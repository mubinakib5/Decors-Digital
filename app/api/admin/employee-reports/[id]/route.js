import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/utils/mongodb";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Helper function to get date range based on period
function getDateRange(period) {
  const now = new Date();
  let start, end;

  switch (period) {
    case 'daily':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      break;
    case 'weekly':
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      start = startOfWeek;
      end = new Date(startOfWeek);
      end.setDate(startOfWeek.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    case 'monthly':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    case 'previous-month-1':
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      break;
    case 'previous-month-2':
      start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      end = new Date(now.getFullYear(), now.getMonth() - 1, 0, 23, 59, 59, 999);
      break;
    case 'previous-month-3':
      start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      end = new Date(now.getFullYear(), now.getMonth() - 2, 0, 23, 59, 59, 999);
      break;
    case 'previous-month-4':
      start = new Date(now.getFullYear(), now.getMonth() - 4, 1);
      end = new Date(now.getFullYear(), now.getMonth() - 3, 0, 23, 59, 59, 999);
      break;
    case 'previous-month-5':
      start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      end = new Date(now.getFullYear(), now.getMonth() - 4, 0, 23, 59, 59, 999);
      break;
    case 'previous-month-6':
      start = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      end = new Date(now.getFullYear(), now.getMonth() - 5, 0, 23, 59, 59, 999);
      break;
    default:
      // Default to current month
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
  }

  return { start, end };
}

// Helper function to determine attendance status
function getAttendanceStatus(clockIn, workSchedule = "9:00-17:00") {
  if (!clockIn) return "absent";
  
  const clockInTime = new Date(clockIn);
  
  // Set late threshold to 10:45 AM
  const lateThreshold = new Date(clockInTime);
  lateThreshold.setHours(10, 45, 0, 0);
  
  if (clockInTime <= lateThreshold) {
    return "on time";
  } else {
    return "late";
  }
}

// Helper function to calculate attendance statistics for charts
function calculateAttendanceChartData(attendanceRecords, leaveRecords, period) {
  const stats = {
    onTime: 0,
    late: 0,
    absent: 0,
    sickLeave: 0,
    casualLeave: 0,
    totalDays: 0
  };

  // Count attendance records (includes both regular attendance and manual entries)
  attendanceRecords.forEach(record => {
    if (record.status === 'on time' || record.status === 'present') {
      stats.onTime++;
    } else if (record.status === 'late') {
      stats.late++;
    }
    stats.totalDays++;
  });

  // Count leave records
  leaveRecords.forEach(leave => {
    if (leave.leaveType === 'sick') {
      stats.sickLeave += leave.leaveDays || 1;
    } else if (leave.leaveType === 'casual') {
      stats.casualLeave += leave.leaveDays || 1;
    }
    stats.totalDays += leave.leaveDays || 1;
  });

  // Calculate working days in period
  const { start, end } = getDateRange(period);
  const totalWorkingDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  
  // Calculate absent days (working days - present days - leave days)
  const presentDays = stats.onTime + stats.late;
  const leaveDays = stats.sickLeave + stats.casualLeave;
  stats.absent = Math.max(0, totalWorkingDays - presentDays - leaveDays);

  return {
    labels: ['On Time', 'Late', 'Absent', 'Sick Leave', 'Casual Leave'],
    data: [stats.onTime, stats.late, stats.absent, stats.sickLeave, stats.casualLeave],
    backgroundColor: [
      '#28a745', // Green for on time
      '#ffc107', // Yellow for late
      '#dc3545', // Red for absent
      '#6f42c1', // Purple for sick leave
      '#17a2b8'  // Teal for casual leave
    ],
    stats: {
      totalWorkingDays,
      presentDays,
      leaveDays,
      absentDays: stats.absent,
      attendanceRate: totalWorkingDays > 0 ? ((presentDays / totalWorkingDays) * 100).toFixed(1) : 0
    }
  };
}

// Force dynamic rendering for API routes
export const dynamic = "force-dynamic";

// Middleware to check authentication (admin only)
async function checkAuth(request) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin-token");

  if (adminToken) {
    try {
      jwt.verify(adminToken.value, process.env.JWT_SECRET || "fallback-secret");
      return true;
    } catch (error) {
      return false;
    }
  }

  return false;
}

// GET - Fetch individual employee attendance data for charts
export async function GET(request, { params }) {
  // Check authentication
  const isAuthenticated = await checkAuth(request);
  if (!isAuthenticated) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'monthly'; // daily, weekly, monthly
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid employee ID" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const { start, end } = getDateRange(period);
    
    // Get employee details
    const employee = await db.collection("employees").findOne({ _id: new ObjectId(id) });
    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    // Get attendance records for the period
    const attendanceRecords = await db.collection("attendance")
      .find({
        employeeId: id,
        date: { $gte: start, $lte: end }
      })
      .sort({ date: 1 })
      .toArray();

    // Get manual time entries for the period
    const manualTimeEntries = await db.collection("manual_time_entries")
      .find({
        employeeId: id,
        date: { $gte: start, $lte: end }
      })
      .sort({ date: 1 })
      .toArray();
    
    // Convert manual time entries to attendance record format
    const manualAttendanceRecords = manualTimeEntries.map(entry => {
      // Skip entries with invalid dates (Unix epoch indicates corrupted data)
      const isValidStartTime = entry.startTime && entry.startTime.getTime() > 0;
      const isValidEndTime = entry.endTime && entry.endTime.getTime() > 0;
      
      if (!isValidStartTime || !isValidEndTime) {
        return null; // Will be filtered out
      }
      
      // Calculate proper attendance status based on clock-in time
      const attendanceStatus = getAttendanceStatus(entry.startTime, employee.workSchedule);
      
      return {
        _id: entry._id.toString(), // Convert ObjectId to string for frontend
        date: entry.date,
        clockIn: entry.startTime,
        clockOut: entry.endTime,
        status: attendanceStatus, // Use calculated status instead of 'manual entry'
        hoursWorked: entry.hoursWorked,
        overtimeHours: entry.overtimeHours,
        description: entry.description,
        projectName: entry.projectName,
        entryType: 'manual'
      };
    }).filter(record => record !== null); // Remove null entries

    // Combine attendance records and manual entries
    const allAttendanceRecords = [...attendanceRecords, ...manualAttendanceRecords]
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Get leave records for the period
    const leaveRecords = await db.collection("leaves")
      .find({
        employeeId: id,
        status: 'approved',
        startDate: { $lte: end },
        endDate: { $gte: start }
      })
      .toArray();

    // Calculate chart data using combined records
    const chartData = calculateAttendanceChartData(allAttendanceRecords, leaveRecords, period);

    return NextResponse.json({
      employee: {
        id: employee._id,
        name: employee.name,
        employeeId: employee.employeeId,
        department: employee.department,
        designation: employee.designation
      },
      period,
      dateRange: {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
      },
      chartData,
      attendanceRecords: allAttendanceRecords.map(record => ({
        _id: record._id ? record._id.toString() : null, // Include ID for editing
        date: record.date,
        clockIn: record.clockIn,
        clockOut: record.clockOut,
        status: record.status,
        hoursWorked: record.hoursWorked,
        overtimeHours: record.overtimeHours,
        description: record.description,
        projectName: record.projectName,
        entryType: record.entryType || 'regular'
      })),
      leaveRecords: leaveRecords.map(leave => ({
        startDate: leave.startDate,
        endDate: leave.endDate,
        leaveType: leave.leaveType,
        reason: leave.reason,
        status: leave.status
      })),
      rawData: {
        attendanceRecords: attendanceRecords.length,
        manualTimeEntries: manualTimeEntries.length,
        totalRecords: allAttendanceRecords.length,
        leaveRecords: leaveRecords.length
      }
    });
  } catch (error) {
    console.error("Error fetching employee report data:", error);
    return NextResponse.json(
      { message: "Error fetching employee report data" },
      { status: 500 }
    );
  }
}