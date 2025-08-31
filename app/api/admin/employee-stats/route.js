import { connectToDatabase } from "@/app/utils/mongodb";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

// Force dynamic rendering for API routes
export const dynamic = "force-dynamic";

// Middleware to check authentication (supports both admin and HR tokens)
async function checkAuth(request) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin-token");
  const hrToken = cookieStore.get("hr-admin-token");

  // Try admin token first
  if (adminToken) {
    try {
      jwt.verify(adminToken.value, process.env.JWT_SECRET || "fallback-secret");
      return true;
    } catch (error) {
      // Continue to try HR token
    }
  }

  // Try HR token
  if (hrToken) {
    try {
      const decoded = jwt.verify(hrToken.value, process.env.JWT_SECRET || "fallback-secret");
      // Verify HR role
      if (decoded.role === "hr_admin" && decoded.department === "human_resource") {
        return true;
      }
    } catch (error) {
      // Token invalid
    }
  }

  return false;
}

// Helper function to calculate date ranges
function getDateRange(period) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  
  switch (period) {
    case 'today':
      return { start: startOfToday, end: endOfToday };
    case 'week':
      const startOfWeek = new Date(startOfToday);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      return { start: startOfWeek, end: endOfWeek };
    case 'month':
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      return { start: startOfMonth, end: endOfMonth };
    case 'year':
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      return { start: startOfYear, end: endOfYear };
    default:
      return { start: startOfToday, end: endOfToday };
  }
}

// GET - Fetch comprehensive employee statistics
export async function GET(request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month'; // today, week, month, year
    const employeeId = searchParams.get('employeeId');
    const department = searchParams.get('department');
    
    const { db } = await connectToDatabase();
    const { start, end } = getDateRange(period);
    
    // Build employee query
    let employeeQuery = { status: 'active' };
    if (employeeId) {
      employeeQuery._id = new ObjectId(employeeId);
    }
    if (department) {
      employeeQuery.department = department;
    }
    
    // Get employees
    const employees = await db.collection("employees").find(employeeQuery).toArray();
    const employeeIds = employees.map(emp => emp._id.toString());
    
    // Get attendance records for the period
    const attendanceRecords = await db.collection("attendance")
      .find({
        employeeId: { $in: employeeIds },
        date: { $gte: start, $lte: end }
      })
      .toArray();
    
    // Get leave records for the period
    const leaveRecords = await db.collection("leaves")
      .find({
        employeeId: { $in: employeeIds },
        status: 'approved',
        startDate: { $lte: end },
        endDate: { $gte: start }
      })
      .toArray();
    
    // Get manual time entries for the period
    const manualTimeEntries = await db.collection("manual_time_entries")
      .find({
        employeeId: { $in: employeeIds },
        date: { $gte: start, $lte: end }
      })
      .toArray();
    
    // Calculate statistics for each employee
    const employeeStats = employees.map(employee => {
      const empId = employee._id.toString();
      
      // Attendance statistics
      const empAttendance = attendanceRecords.filter(record => record.employeeId === empId);
      const totalDays = empAttendance.length;
      const onTimeDays = empAttendance.filter(record => record.status === 'on time').length;
      const lateDays = empAttendance.filter(record => record.status === 'late').length;
      const totalHours = empAttendance.reduce((sum, record) => sum + (record.hoursWorked || 0), 0);
      const overtimeHours = empAttendance.reduce((sum, record) => sum + (record.overtimeHours || 0), 0);
      
      // Leave statistics
      const empLeaves = leaveRecords.filter(record => record.employeeId === empId);
      const sickLeaves = empLeaves.filter(leave => leave.leaveType === 'sick');
      const casualLeaves = empLeaves.filter(leave => leave.leaveType === 'casual');
      const annualLeaves = empLeaves.filter(leave => leave.leaveType === 'annual');
      
      const totalSickDays = sickLeaves.reduce((sum, leave) => sum + leave.leaveDays, 0);
      const totalCasualDays = casualLeaves.reduce((sum, leave) => sum + leave.leaveDays, 0);
      const totalAnnualDays = annualLeaves.reduce((sum, leave) => sum + leave.leaveDays, 0);
      
      // Manual time entries
      const empManualEntries = manualTimeEntries.filter(entry => entry.employeeId === empId);
      const manualHours = empManualEntries.reduce((sum, entry) => sum + (entry.hoursWorked || 0), 0);
      
      // Remote work statistics
      const remoteWorkDays = employee.remoteWorkStatus?.remoteWorkDays || [];
      const remoteWorkDaysInPeriod = remoteWorkDays.filter(day => {
        const dayDate = new Date(day);
        return dayDate >= start && dayDate <= end;
      }).length;
      
      return {
        employeeId: employee._id,
        employeeCode: employee.employeeId,
        name: employee.name,
        department: employee.department,
        designation: employee.designation,
        isIntern: employee.isIntern || false,
        attendance: {
          totalDays,
          onTimeDays,
          lateDays,
          absentDays: Math.max(0, getWorkingDaysInPeriod(start, end) - totalDays - getTotalLeaveDaysInPeriod(empLeaves, start, end)),
          totalHours: parseFloat(totalHours.toFixed(2)),
          overtimeHours: parseFloat(overtimeHours.toFixed(2)),
          averageHoursPerDay: totalDays > 0 ? parseFloat((totalHours / totalDays).toFixed(2)) : 0
        },
        leaves: {
          sick: {
            taken: totalSickDays,
            available: employee.leaveBalances?.sick || 0,
            remaining: Math.max(0, (employee.leaveBalances?.sick || 0) - (employee.leaveBalances?.usedSick || 0))
          },
          casual: {
            taken: totalCasualDays,
            available: employee.leaveBalances?.casual || 0,
            remaining: Math.max(0, (employee.leaveBalances?.casual || 0) - (employee.leaveBalances?.usedCasual || 0))
          },
          annual: {
            taken: totalAnnualDays,
            available: employee.leaveBalances?.annual || 0,
            remaining: Math.max(0, (employee.leaveBalances?.annual || 0) - (employee.leaveBalances?.usedAnnual || 0))
          },
          totalTaken: totalSickDays + totalCasualDays + totalAnnualDays
        },
        remoteWork: {
          isEnabled: employee.remoteWorkStatus?.isRemoteEnabled || false,
          currentStatus: employee.remoteWorkStatus?.currentStatus || 'office',
          daysInPeriod: remoteWorkDaysInPeriod,
          lastStatusUpdate: employee.remoteWorkStatus?.lastStatusUpdate
        },
        manualTimeEntries: {
          totalEntries: empManualEntries.length,
          totalHours: parseFloat(manualHours.toFixed(2))
        }
      };
    });
    
    // Separate regular employees and interns
    const regularEmployees = employees.filter(emp => !emp.isIntern);
    const interns = employees.filter(emp => emp.isIntern);
    const regularEmployeeStats = employeeStats.filter((_, index) => !employees[index].isIntern);
    const internStats = employeeStats.filter((_, index) => employees[index].isIntern);
    
    // Calculate overall statistics
    const overallStats = {
      totalEmployees: employees.length,
      totalRegularEmployees: regularEmployees.length,
      totalInterns: interns.length,
      period: period,
      dateRange: { start, end },
      attendance: {
        totalPresent: employeeStats.reduce((sum, emp) => sum + emp.attendance.totalDays, 0),
        totalOnTime: employeeStats.reduce((sum, emp) => sum + emp.attendance.onTimeDays, 0),
        totalLate: employeeStats.reduce((sum, emp) => sum + emp.attendance.lateDays, 0),
        totalAbsent: employeeStats.reduce((sum, emp) => sum + emp.attendance.absentDays, 0),
        totalHours: employeeStats.reduce((sum, emp) => sum + emp.attendance.totalHours, 0),
        totalOvertimeHours: employeeStats.reduce((sum, emp) => sum + emp.attendance.overtimeHours, 0),
        // Regular employees stats
        regular: {
          totalPresent: regularEmployeeStats.reduce((sum, emp) => sum + emp.attendance.totalDays, 0),
          totalOnTime: regularEmployeeStats.reduce((sum, emp) => sum + emp.attendance.onTimeDays, 0),
          totalLate: regularEmployeeStats.reduce((sum, emp) => sum + emp.attendance.lateDays, 0),
          totalAbsent: regularEmployeeStats.reduce((sum, emp) => sum + emp.attendance.absentDays, 0),
          totalHours: regularEmployeeStats.reduce((sum, emp) => sum + emp.attendance.totalHours, 0),
          totalOvertimeHours: regularEmployeeStats.reduce((sum, emp) => sum + emp.attendance.overtimeHours, 0)
        },
        // Intern stats
        interns: {
          totalPresent: internStats.reduce((sum, emp) => sum + emp.attendance.totalDays, 0),
          totalOnTime: internStats.reduce((sum, emp) => sum + emp.attendance.onTimeDays, 0),
          totalLate: internStats.reduce((sum, emp) => sum + emp.attendance.lateDays, 0),
          totalAbsent: internStats.reduce((sum, emp) => sum + emp.attendance.absentDays, 0),
          totalHours: internStats.reduce((sum, emp) => sum + emp.attendance.totalHours, 0),
          totalOvertimeHours: internStats.reduce((sum, emp) => sum + emp.attendance.overtimeHours, 0)
        }
      },
      leaves: {
        totalSickDays: employeeStats.reduce((sum, emp) => sum + emp.leaves.sick.taken, 0),
        totalCasualDays: employeeStats.reduce((sum, emp) => sum + emp.leaves.casual.taken, 0),
        totalAnnualDays: employeeStats.reduce((sum, emp) => sum + emp.leaves.annual.taken, 0),
        totalLeaveDays: employeeStats.reduce((sum, emp) => sum + emp.leaves.totalTaken, 0),
        // Regular employees leave stats
        regular: {
          totalSickDays: regularEmployeeStats.reduce((sum, emp) => sum + emp.leaves.sick.taken, 0),
          totalCasualDays: regularEmployeeStats.reduce((sum, emp) => sum + emp.leaves.casual.taken, 0),
          totalAnnualDays: regularEmployeeStats.reduce((sum, emp) => sum + emp.leaves.annual.taken, 0),
          totalLeaveDays: regularEmployeeStats.reduce((sum, emp) => sum + emp.leaves.totalTaken, 0)
        },
        // Intern leave stats
        interns: {
          totalSickDays: internStats.reduce((sum, emp) => sum + emp.leaves.sick.taken, 0),
          totalCasualDays: internStats.reduce((sum, emp) => sum + emp.leaves.casual.taken, 0),
          totalAnnualDays: internStats.reduce((sum, emp) => sum + emp.leaves.annual.taken, 0),
          totalLeaveDays: internStats.reduce((sum, emp) => sum + emp.leaves.totalTaken, 0)
        }
      },
      remoteWork: {
        totalRemoteEnabled: employeeStats.filter(emp => emp.remoteWork.isEnabled).length,
        currentlyRemote: employeeStats.filter(emp => emp.remoteWork.currentStatus === 'remote').length,
        currentlyHybrid: employeeStats.filter(emp => emp.remoteWork.currentStatus === 'hybrid').length,
        totalRemoteDays: employeeStats.reduce((sum, emp) => sum + emp.remoteWork.daysInPeriod, 0)
      },
      manualTimeEntries: {
        totalEntries: employeeStats.reduce((sum, emp) => sum + emp.manualTimeEntries.totalEntries, 0),
        totalHours: employeeStats.reduce((sum, emp) => sum + emp.manualTimeEntries.totalHours, 0)
      }
    };
    
    return NextResponse.json({
      overallStats,
      employeeStats,
      period,
      dateRange: { start, end }
    });
  } catch (error) {
    console.error("Error fetching employee statistics:", error);
    return NextResponse.json(
      { message: "Error fetching employee statistics" },
      { status: 500 }
    );
  }
}

// Helper function to calculate working days in a period (excluding weekends)
function getWorkingDaysInPeriod(start, end) {
  let count = 0;
  const current = new Date(start);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Sunday (0) and Saturday (6)
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

// Helper function to calculate total leave days in a period
function getTotalLeaveDaysInPeriod(leaves, start, end) {
  return leaves.reduce((total, leave) => {
    const leaveStart = new Date(leave.startDate);
    const leaveEnd = new Date(leave.endDate);
    
    // Calculate overlap between leave period and query period
    const overlapStart = new Date(Math.max(leaveStart.getTime(), start.getTime()));
    const overlapEnd = new Date(Math.min(leaveEnd.getTime(), end.getTime()));
    
    if (overlapStart <= overlapEnd) {
      const overlapDays = Math.ceil((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return total + overlapDays;
    }
    
    return total;
  }, 0);
}