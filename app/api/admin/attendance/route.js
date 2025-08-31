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

// Helper function to calculate overtime hours
function calculateOvertimeHours(clockIn, clockOut, workSchedule = "9:00-17:00") {
  if (!clockIn || !clockOut) return 0;
  
  const clockInTime = new Date(clockIn);
  const clockOutTime = new Date(clockOut);
  
  // Parse work schedule (e.g., "9:00-17:00")
  const [startTime, endTime] = workSchedule.split("-");
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  
  // Create expected end time for the same day
  const expectedEndTime = new Date(clockInTime);
  expectedEndTime.setHours(endHour, endMinute, 0, 0);
  
  // Calculate overtime if clocked out after expected end time
  if (clockOutTime > expectedEndTime) {
    const overtimeMs = clockOutTime.getTime() - expectedEndTime.getTime();
    return Math.round((overtimeMs / (1000 * 60 * 60)) * 100) / 100; // Round to 2 decimal places
  }
  
  return 0;
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

// GET - Fetch all attendance records
export async function GET(request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    const { db } = await connectToDatabase();
    
    let query = {};
    
    // Filter by employee ID if provided
    if (employeeId) {
      query.employeeId = employeeId;
    }
    
    // Filter by date range if provided
    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.date = {
        $gte: targetDate,
        $lt: nextDay
      };
    } else if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const attendance = await db.collection("attendance")
      .find(query)
      .sort({ date: -1, clockIn: -1 })
      .toArray();
    
    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { message: "Error fetching attendance" },
      { status: 500 }
    );
  }
}

// POST - Record clock in/out
export async function POST(request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { employeeId, action, timestamp } = await request.json();
    
    // Validate required fields
    if (!employeeId || !action || !timestamp) {
      return NextResponse.json(
        { message: "Employee ID, action, and timestamp are required" },
        { status: 400 }
      );
    }
    
    if (!['in', 'out'].includes(action)) {
      return NextResponse.json(
        { message: "Action must be 'in' or 'out'" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Verify employee exists
    const employee = await db.collection("employees").findOne({ _id: new ObjectId(employeeId) });
    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }
    
    const actionTime = new Date(timestamp);
    const dateOnly = new Date(actionTime.getFullYear(), actionTime.getMonth(), actionTime.getDate());
    
    // Find existing attendance record for today
    let attendanceRecord = await db.collection("attendance").findOne({
      employeeId: new ObjectId(employeeId),
      date: dateOnly
    });
    
    if (action === 'in') {
      if (attendanceRecord && attendanceRecord.clockIn) {
        return NextResponse.json(
          { message: "Employee has already clocked in today" },
          { status: 400 }
        );
      }
      
      const status = getAttendanceStatus(actionTime, employee.workSchedule);
      
      if (attendanceRecord) {
        // Update existing record
        await db.collection("attendance").updateOne(
          { _id: attendanceRecord._id },
          { 
            $set: { 
              clockIn: actionTime,
              status: status,
              updatedAt: new Date()
            }
          }
        );
      } else {
        // Create new record
        await db.collection("attendance").insertOne({
          employeeId: new ObjectId(employeeId),
          date: dateOnly,
          clockIn: actionTime,
          status: status,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      return NextResponse.json({ message: "Clock in recorded successfully" });
    } else { // action === 'out'
      if (!attendanceRecord || !attendanceRecord.clockIn) {
        return NextResponse.json(
          { message: "Employee must clock in first" },
          { status: 400 }
        );
      }
      
      if (attendanceRecord.clockOut) {
        return NextResponse.json(
          { message: "Employee has already clocked out today" },
          { status: 400 }
        );
      }
      
      const overtimeHours = calculateOvertimeHours(
        attendanceRecord.clockIn,
        actionTime,
        employee.workSchedule
      );
      
      // Update record with clock out time and overtime
      await db.collection("attendance").updateOne(
        { _id: attendanceRecord._id },
        { 
          $set: { 
            clockOut: actionTime,
            overtimeHours: overtimeHours,
            updatedAt: new Date()
          }
        }
      );
      
      return NextResponse.json({ 
        message: "Clock out recorded successfully",
        overtimeHours: overtimeHours
      });
    }
  } catch (error) {
    console.error("Error recording attendance:", error);
    return NextResponse.json(
      { message: "Error recording attendance" },
      { status: 500 }
    );
  }
}

// PUT - Update attendance record (for manual corrections)
export async function PUT(request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { employeeId, date, clockIn, clockOut, status } = await request.json();
    console.log('PUT request data:', { employeeId, date, clockIn, clockOut, status });
    
    if (!employeeId || !date) {
      return NextResponse.json(
        { message: "Employee ID and date are required" },
        { status: 400 }
      );
    }
    
    if (!ObjectId.isValid(employeeId)) {
      return NextResponse.json(
        { message: "Invalid employee ID" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Parse the date to match how dates are stored (dateOnly format)
    const targetDate = new Date(date);
    // Since the frontend sends UTC date, use it directly
    const dateOnly = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    console.log('Searching for attendance record:', { employeeId, dateOnly });
    
    // Find existing attendance record for this employee and date
    // Search by date range since existing records use 'date' field, not 'dateOnly'
    const startOfDay = new Date(dateOnly);
    const endOfDay = new Date(dateOnly);
    endOfDay.setDate(endOfDay.getDate() + 1);
    
    const attendanceRecord = await db.collection("attendance").findOne({
      employeeId: new ObjectId(employeeId),
      date: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    });
    
    console.log('Found attendance record:', attendanceRecord);
    
    if (!attendanceRecord) {
      return NextResponse.json(
        { message: "Attendance record not found" },
        { status: 404 }
      );
    }
    
    // Get employee info for overtime calculation
    const employee = await db.collection("employees").findOne({ _id: new ObjectId(employeeId) });
    
    const updateData = {
      updatedAt: new Date()
    };
    
    if (clockIn) updateData.clockIn = new Date(clockIn);
    if (clockOut) updateData.clockOut = new Date(clockOut);
    if (status) updateData.status = status;
    
    // Recalculate overtime if both times are provided
    const finalClockIn = updateData.clockIn || attendanceRecord.clockIn;
    const finalClockOut = updateData.clockOut || attendanceRecord.clockOut;
    
    if (finalClockIn && finalClockOut) {
      updateData.overtimeHours = calculateOvertimeHours(
        finalClockIn,
        finalClockOut,
        employee?.workSchedule
      );
    }
    
    // Recalculate status if clock in time is updated
    if (updateData.clockIn && !updateData.status) {
      updateData.status = getAttendanceStatus(updateData.clockIn, employee?.workSchedule);
    }
    
    await db.collection("attendance").updateOne(
      { _id: attendanceRecord._id },
      { $set: updateData }
    );
    
    return NextResponse.json({ message: "Attendance record updated successfully" });
  } catch (error) {
    console.error("Error updating attendance:", error);
    return NextResponse.json(
      { message: "Error updating attendance" },
      { status: 500 }
    );
  }
}

// DELETE - Remove attendance record (Undo functionality)
export async function DELETE(request) {
  console.log('DELETE request received');
  
  // Check authentication
  const isAuthenticated = await checkAuth(request);
  if (!isAuthenticated) {
    console.log('Authentication failed');
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { employeeId, date } = await request.json();
    console.log('DELETE request data:', { employeeId, date });

    // Validate required fields
    if (!employeeId || !date) {
      console.log('Missing required fields');
      return NextResponse.json(
        { message: "Employee ID and date are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Parse the date to get start and end of day
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999);
    
    console.log('Date range for deletion:', { targetDate, startOfDay, endOfDay });
    console.log('Searching for attendance record with employeeId:', employeeId);

    // Delete the attendance record for the specified employee and date
    // Try both string and ObjectId formats for employeeId
    let query = {
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    };
    
    // Try with ObjectId first if it's a valid ObjectId format
    if (ObjectId.isValid(employeeId)) {
      query.employeeId = new ObjectId(employeeId);
    } else {
      query.employeeId = employeeId;
    }
    
    console.log('Final delete query:', query);
    const result = await db.collection("attendance").deleteOne(query);
    
    // If no result with ObjectId, try with string
    if (result.deletedCount === 0 && ObjectId.isValid(employeeId)) {
      query.employeeId = employeeId;
      console.log('Retrying with string employeeId:', query);
      const retryResult = await db.collection("attendance").deleteOne(query);
      console.log('Retry delete result:', retryResult);
      result.deletedCount = retryResult.deletedCount;
    }
    
    console.log('Delete operation result:', result);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "No attendance record found to delete" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Attendance record deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting attendance:", error);
    return NextResponse.json(
      { message: "Error deleting attendance" },
      { status: 500 }
    );
  }
}