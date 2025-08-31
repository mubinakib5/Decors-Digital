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

// Helper function to calculate hours worked
function calculateHoursWorked(startTime, endTime) {
  if (!startTime || !endTime) return 0;
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end.getTime() - start.getTime();
  return Math.max(0, diffMs / (1000 * 60 * 60)); // Convert to hours
}

// Helper function to calculate overtime hours
function calculateOvertimeHours(hoursWorked, workSchedule = "9:00-17:00") {
  const [startTime, endTime] = workSchedule.split("-");
  const [startHour] = startTime.split(":").map(Number);
  const [endHour] = endTime.split(":").map(Number);
  const standardHours = endHour - startHour;
  
  return Math.max(0, hoursWorked - standardHours);
}

// GET - Fetch manual time entries
export async function GET(request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    const { db } = await connectToDatabase();
    
    let query = {};
    
    // Filter by employee ID if provided
    if (employeeId) {
      query.employeeId = employeeId;
    }
    
    // Filter by date range if provided
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const manualEntries = await db.collection("manual_time_entries")
      .find(query)
      .sort({ date: -1, createdAt: -1 })
      .toArray();
    
    return NextResponse.json(manualEntries);
  } catch (error) {
    console.error("Error fetching manual time entries:", error);
    return NextResponse.json(
      { message: "Error fetching manual time entries" },
      { status: 500 }
    );
  }
}

// POST - Create manual time entry
export async function POST(request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { employeeId, date, startTime, endTime, description, projectName } = await request.json();
    
    // Validate required fields
    if (!employeeId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { message: "Employee ID, date, start time, and end time are required" },
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
    
    // Verify employee exists
    const employee = await db.collection("employees").findOne({ _id: new ObjectId(employeeId) });
    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }
    
    // Create full datetime objects for calculation
    const entryDate = new Date(date);
    const startDateTime = new Date(`${date}T${startTime}:00`);
    const endDateTime = new Date(`${date}T${endTime}:00`);
    
    // Validate time range
    if (startDateTime >= endDateTime) {
      return NextResponse.json(
        { message: "End time must be after start time" },
        { status: 400 }
      );
    }
    
    // Calculate hours worked
    const hoursWorked = calculateHoursWorked(startDateTime, endDateTime);
    const overtimeHours = calculateOvertimeHours(hoursWorked, employee.workSchedule);
    
    const newEntry = {
      employeeId: employeeId,
      employeeName: employee.name,
      date: entryDate,
      startTime: startDateTime,
      endTime: endDateTime,
      hoursWorked: parseFloat(hoursWorked.toFixed(2)),
      overtimeHours: parseFloat(overtimeHours.toFixed(2)),
      description: description || '',
      projectName: projectName || '',
      entryType: 'manual',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection("manual_time_entries").insertOne(newEntry);
    
    return NextResponse.json(
      { 
        message: "Manual time entry created successfully", 
        id: result.insertedId,
        hoursWorked: hoursWorked.toFixed(2),
        overtimeHours: overtimeHours.toFixed(2)
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating manual time entry:", error);
    return NextResponse.json(
      { message: "Error creating manual time entry" },
      { status: 500 }
    );
  }
}

// PUT - Update manual time entry
export async function PUT(request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, employeeId, date, startTime, endTime, description, projectName } = await request.json();
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Valid entry ID is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Find existing entry
    const existingEntry = await db.collection("manual_time_entries").findOne({ _id: new ObjectId(id) });
    if (!existingEntry) {
      return NextResponse.json(
        { message: "Manual time entry not found" },
        { status: 404 }
      );
    }
    
    // Get employee info for calculations
    const employee = await db.collection("employees").findOne({ _id: new ObjectId(existingEntry.employeeId) });
    
    const updateData = {
      updatedAt: new Date()
    };
    
    // Update fields if provided
    if (date) updateData.date = new Date(date);
    if (startTime) updateData.startTime = new Date(`${date || existingEntry.date.toISOString().split('T')[0]}T${startTime}:00`);
    if (endTime) updateData.endTime = new Date(`${date || existingEntry.date.toISOString().split('T')[0]}T${endTime}:00`);
    if (description !== undefined) updateData.description = description;
    if (projectName !== undefined) updateData.projectName = projectName;
    
    // Recalculate hours if times are updated
    const finalStartTime = updateData.startTime || existingEntry.startTime;
    const finalEndTime = updateData.endTime || existingEntry.endTime;
    
    if (finalStartTime && finalEndTime) {
      const hoursWorked = calculateHoursWorked(finalStartTime, finalEndTime);
      const overtimeHours = calculateOvertimeHours(hoursWorked, employee?.workSchedule);
      
      updateData.hoursWorked = parseFloat(hoursWorked.toFixed(2));
      updateData.overtimeHours = parseFloat(overtimeHours.toFixed(2));
    }
    
    await db.collection("manual_time_entries").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    return NextResponse.json({ message: "Manual time entry updated successfully" });
  } catch (error) {
    console.error("Error updating manual time entry:", error);
    return NextResponse.json(
      { message: "Error updating manual time entry" },
      { status: 500 }
    );
  }
}

// DELETE - Delete manual time entry
export async function DELETE(request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Valid entry ID is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const result = await db.collection("manual_time_entries").deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Manual time entry not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: "Manual time entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting manual time entry:", error);
    return NextResponse.json(
      { message: "Error deleting manual time entry" },
      { status: 500 }
    );
  }
}