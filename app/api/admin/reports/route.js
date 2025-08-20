import { connectToDatabase } from "@/app/utils/mongodb";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

// Force dynamic rendering for API routes
export const dynamic = "force-dynamic";

// Middleware to check authentication
async function checkAuth(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");

  if (!token) {
    return false;
  }

  try {
    jwt.verify(token.value, process.env.JWT_SECRET || "fallback-secret");
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to get date range based on report type
function getDateRange(reportType, customStartDate = null, customEndDate = null) {
  const now = new Date();
  let startDate, endDate;

  if (customStartDate && customEndDate) {
    startDate = new Date(customStartDate);
    endDate = new Date(customEndDate);
    endDate.setHours(23, 59, 59, 999); // End of day
  } else {
    switch (reportType) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        break;
      case 'weekly':
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when day is Sunday
        startDate = new Date(now.setDate(diff));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      default:
        throw new Error('Invalid report type');
    }
  }

  return { startDate, endDate };
}

// Helper function to calculate attendance statistics
function calculateAttendanceStats(attendanceRecords) {
  const stats = {
    totalDays: attendanceRecords.length,
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
    totalHours: 0,
    overtimeHours: 0,
    averageHours: 0
  };

  attendanceRecords.forEach(record => {
    switch (record.status) {
      case 'present':
        stats.presentDays++;
        break;
      case 'absent':
        stats.absentDays++;
        break;
      case 'late':
        stats.lateDays++;
        stats.presentDays++; // Late is still present
        break;
    }

    if (record.hoursWorked) {
      stats.totalHours += record.hoursWorked;
    }
    if (record.overtimeHours) {
      stats.overtimeHours += record.overtimeHours;
    }
  });

  stats.averageHours = stats.totalDays > 0 ? (stats.totalHours / stats.totalDays).toFixed(2) : 0;
  stats.attendanceRate = stats.totalDays > 0 ? ((stats.presentDays / stats.totalDays) * 100).toFixed(2) : 0;

  return stats;
}

// GET - Generate attendance reports
export async function GET(request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'daily'; // daily, weekly, monthly, custom
    const employeeId = searchParams.get('employeeId');
    const department = searchParams.get('department');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const format = searchParams.get('format') || 'json'; // json, summary

    // Validate report type
    if (!['daily', 'weekly', 'monthly', 'custom'].includes(reportType)) {
      return NextResponse.json(
        { message: "Invalid report type. Use: daily, weekly, monthly, or custom" },
        { status: 400 }
      );
    }

    // For custom reports, start and end dates are required
    if (reportType === 'custom' && (!startDate || !endDate)) {
      return NextResponse.json(
        { message: "Start date and end date are required for custom reports" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Get date range
    const { startDate: rangeStart, endDate: rangeEnd } = getDateRange(
      reportType,
      startDate,
      endDate
    );

    // Build attendance query
    let attendanceQuery = {
      date: {
        $gte: rangeStart,
        $lte: rangeEnd
      }
    };

    // Filter by employee if specified
    if (employeeId) {
      attendanceQuery.employeeId = employeeId;
    }

    // Build employee query for department filtering
    let employeeQuery = {};
    if (department) {
      employeeQuery.department = department;
    }

    // Get employees (for filtering and additional info)
    const employees = await db.collection("employees").find(employeeQuery).toArray();
    const employeeMap = new Map(employees.map(emp => [emp._id.toString(), emp]));

    // Filter attendance by department if specified
    if (department) {
      const employeeIds = employees.map(emp => emp._id.toString());
      attendanceQuery.employeeId = { $in: employeeIds };
    }

    // Get attendance records
    const attendanceRecords = await db.collection("attendance")
      .find(attendanceQuery)
      .sort({ date: -1, employeeId: 1 })
      .toArray();

    // Get leave records for the same period
    const leaveRecords = await db.collection("leaves")
      .find({
        status: 'approved',
        startDate: { $lte: rangeEnd },
        endDate: { $gte: rangeStart }
      })
      .toArray();

    // Process data based on format
    if (format === 'summary') {
      // Generate summary report
      const summary = {
        reportType,
        period: {
          startDate: rangeStart,
          endDate: rangeEnd
        },
        totalEmployees: employeeId ? 1 : employees.length,
        overallStats: calculateAttendanceStats(attendanceRecords),
        departmentStats: {},
        employeeStats: []
      };

      // Group by department for department stats
      if (!employeeId && !department) {
        const departmentGroups = {};
        attendanceRecords.forEach(record => {
          const employee = employeeMap.get(record.employeeId);
          if (employee) {
            const dept = employee.department || 'Unknown';
            if (!departmentGroups[dept]) {
              departmentGroups[dept] = [];
            }
            departmentGroups[dept].push(record);
          }
        });

        Object.keys(departmentGroups).forEach(dept => {
          summary.departmentStats[dept] = calculateAttendanceStats(departmentGroups[dept]);
        });
      }

      // Group by employee for individual stats
      const employeeGroups = {};
      attendanceRecords.forEach(record => {
        if (!employeeGroups[record.employeeId]) {
          employeeGroups[record.employeeId] = [];
        }
        employeeGroups[record.employeeId].push(record);
      });

      Object.keys(employeeGroups).forEach(empId => {
        const employee = employeeMap.get(empId);
        if (employee) {
          const empStats = calculateAttendanceStats(employeeGroups[empId]);
          summary.employeeStats.push({
            employeeId: empId,
            employeeName: employee.name,
            department: employee.department,
            ...empStats
          });
        }
      });

      return NextResponse.json(summary);
    } else {
      // Generate detailed report
      const detailedRecords = attendanceRecords.map(record => {
        const employee = employeeMap.get(record.employeeId);
        return {
          ...record,
          employeeName: employee?.name || 'Unknown',
          department: employee?.department || 'Unknown',
          designation: employee?.designation || 'Unknown'
        };
      });

      const report = {
        reportType,
        period: {
          startDate: rangeStart,
          endDate: rangeEnd
        },
        totalRecords: detailedRecords.length,
        records: detailedRecords,
        leaves: leaveRecords.map(leave => {
          const employee = employeeMap.get(leave.employeeId);
          return {
            ...leave,
            employeeName: employee?.name || 'Unknown',
            department: employee?.department || 'Unknown'
          };
        }),
        summary: calculateAttendanceStats(attendanceRecords)
      };

      return NextResponse.json(report);
    }
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { message: "Error generating report" },
      { status: 500 }
    );
  }
}

// POST - Generate custom reports with advanced filtering
export async function POST(request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      reportType,
      startDate,
      endDate,
      employeeIds,
      departments,
      includeLeaves,
      groupBy, // 'employee', 'department', 'date'
      metrics // array of metrics to include
    } = await request.json();

    // Validate required fields
    if (!reportType || !startDate || !endDate) {
      return NextResponse.json(
        { message: "Report type, start date, and end date are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const rangeStart = new Date(startDate);
    const rangeEnd = new Date(endDate);
    rangeEnd.setHours(23, 59, 59, 999);

    // Build queries
    let attendanceQuery = {
      date: {
        $gte: rangeStart,
        $lte: rangeEnd
      }
    };

    let employeeQuery = {};

    // Filter by specific employees
    if (employeeIds && employeeIds.length > 0) {
      attendanceQuery.employeeId = { $in: employeeIds };
      employeeQuery._id = { $in: employeeIds.map(id => new ObjectId(id)) };
    }

    // Filter by departments
    if (departments && departments.length > 0) {
      employeeQuery.department = { $in: departments };
    }

    // Get employees
    const employees = await db.collection("employees").find(employeeQuery).toArray();
    const employeeMap = new Map(employees.map(emp => [emp._id.toString(), emp]));

    // Apply department filter to attendance if needed
    if (departments && departments.length > 0 && (!employeeIds || employeeIds.length === 0)) {
      const deptEmployeeIds = employees.map(emp => emp._id.toString());
      attendanceQuery.employeeId = { $in: deptEmployeeIds };
    }

    // Get attendance records
    const attendanceRecords = await db.collection("attendance")
      .find(attendanceQuery)
      .sort({ date: -1, employeeId: 1 })
      .toArray();

    // Get leave records if requested
    let leaveRecords = [];
    if (includeLeaves) {
      let leaveQuery = {
        status: 'approved',
        startDate: { $lte: rangeEnd },
        endDate: { $gte: rangeStart }
      };

      if (employeeIds && employeeIds.length > 0) {
        leaveQuery.employeeId = { $in: employeeIds };
      } else if (departments && departments.length > 0) {
        const deptEmployeeIds = employees.map(emp => emp._id.toString());
        leaveQuery.employeeId = { $in: deptEmployeeIds };
      }

      leaveRecords = await db.collection("leaves").find(leaveQuery).toArray();
    }

    // Process and group data
    let groupedData = {};
    const defaultMetrics = ['totalDays', 'presentDays', 'absentDays', 'lateDays', 'totalHours', 'overtimeHours'];
    const selectedMetrics = metrics && metrics.length > 0 ? metrics : defaultMetrics;

    if (groupBy === 'employee') {
      // Group by employee
      const employeeGroups = {};
      attendanceRecords.forEach(record => {
        if (!employeeGroups[record.employeeId]) {
          employeeGroups[record.employeeId] = [];
        }
        employeeGroups[record.employeeId].push(record);
      });

      Object.keys(employeeGroups).forEach(empId => {
        const employee = employeeMap.get(empId);
        if (employee) {
          const stats = calculateAttendanceStats(employeeGroups[empId]);
          const filteredStats = {};
          selectedMetrics.forEach(metric => {
            if (stats[metric] !== undefined) {
              filteredStats[metric] = stats[metric];
            }
          });

          groupedData[empId] = {
            employeeName: employee.name,
            department: employee.department,
            designation: employee.designation,
            ...filteredStats
          };
        }
      });
    } else if (groupBy === 'department') {
      // Group by department
      const departmentGroups = {};
      attendanceRecords.forEach(record => {
        const employee = employeeMap.get(record.employeeId);
        if (employee) {
          const dept = employee.department || 'Unknown';
          if (!departmentGroups[dept]) {
            departmentGroups[dept] = [];
          }
          departmentGroups[dept].push(record);
        }
      });

      Object.keys(departmentGroups).forEach(dept => {
        const stats = calculateAttendanceStats(departmentGroups[dept]);
        const filteredStats = {};
        selectedMetrics.forEach(metric => {
          if (stats[metric] !== undefined) {
            filteredStats[metric] = stats[metric];
          }
        });
        groupedData[dept] = filteredStats;
      });
    } else {
      // Default: return all records with employee info
      groupedData = attendanceRecords.map(record => {
        const employee = employeeMap.get(record.employeeId);
        return {
          ...record,
          employeeName: employee?.name || 'Unknown',
          department: employee?.department || 'Unknown',
          designation: employee?.designation || 'Unknown'
        };
      });
    }

    const report = {
      reportType: 'custom',
      period: {
        startDate: rangeStart,
        endDate: rangeEnd
      },
      groupBy: groupBy || 'none',
      metrics: selectedMetrics,
      data: groupedData,
      summary: calculateAttendanceStats(attendanceRecords)
    };

    if (includeLeaves) {
      report.leaves = leaveRecords.map(leave => {
        const employee = employeeMap.get(leave.employeeId);
        return {
          ...leave,
          employeeName: employee?.name || 'Unknown',
          department: employee?.department || 'Unknown'
        };
      });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error generating custom report:", error);
    return NextResponse.json(
      { message: "Error generating custom report" },
      { status: 500 }
    );
  }
}