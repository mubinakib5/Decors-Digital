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
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
  }

  return { start, end };
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

  // Count attendance records
  attendanceRecords.forEach(record => {
    if (record.status === 'on time') {
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

    // Get leave records for the period
    const leaveRecords = await db.collection("leaves")
      .find({
        employeeId: id,
        status: 'approved',
        startDate: { $lte: end },
        endDate: { $gte: start }
      })
      .toArray();

    // Calculate chart data
    const chartData = calculateAttendanceChartData(attendanceRecords, leaveRecords, period);

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
      rawData: {
        attendanceRecords: attendanceRecords.length,
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