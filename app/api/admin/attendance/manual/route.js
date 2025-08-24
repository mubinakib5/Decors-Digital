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

// POST - Create manual attendance record
export async function POST(request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { employeeId, date, status } = await request.json();
    
    // Validate required fields
    if (!employeeId || !date || !status) {
      return NextResponse.json(
        { message: "Employee ID, date, and status are required" },
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
    
    const targetDate = new Date(date);
    const dateOnly = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    
    // Check if attendance record already exists for this date
    const existingRecord = await db.collection("attendance").findOne({
      employeeId: employeeId,
      date: dateOnly
    });
    
    if (existingRecord) {
      return NextResponse.json(
        { message: "Attendance record already exists for this date" },
        { status: 400 }
      );
    }
    
    // Create new manual attendance record
    const newRecord = {
      employeeId: employeeId,
      date: dateOnly,
      status: status,
      clockIn: null,
      clockOut: null,
      overtimeHours: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      isManual: true
    };
    
    await db.collection("attendance").insertOne(newRecord);
    
    return NextResponse.json({ 
      message: "Manual attendance record created successfully",
      record: newRecord
    });
    
  } catch (error) {
    console.error("Error creating manual attendance record:", error);
    return NextResponse.json(
      { message: "Error creating manual attendance record" },
      { status: 500 }
    );
  }
}