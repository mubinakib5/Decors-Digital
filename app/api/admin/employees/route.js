import { connectToDatabase } from "@/app/utils/mongodb";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

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

// GET - Fetch all employees
export async function GET(request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db } = await connectToDatabase();
    const employees = await db.collection("employees").find({}).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { message: "Error fetching employees" },
      { status: 500 }
    );
  }
}

// POST - Create new employee
export async function POST(request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const employeeData = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'employeeId', 'department', 'designation', 'email', 'phone'];
    for (const field of requiredFields) {
      if (!employeeData[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const { db } = await connectToDatabase();
    
    // Check if employee ID already exists
    const existingEmployee = await db.collection("employees").findOne({ employeeId: employeeData.employeeId });
    if (existingEmployee) {
      return NextResponse.json(
        { message: "Employee ID already exists" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await db.collection("employees").findOne({ email: employeeData.email });
    if (existingEmail) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    const newEmployee = {
      ...employeeData,
      isIntern: employeeData.isIntern || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      // Leave balances
      leaveBalances: {
        sick: employeeData.sickLeaveBalance || 10, // Default 10 days per year
        casual: employeeData.casualLeaveBalance || 15, // Default 15 days per year
        annual: employeeData.annualLeaveBalance || 21, // Default 21 days per year
        usedSick: 0,
        usedCasual: 0,
        usedAnnual: 0
      },
      // Remote work status
      remoteWorkStatus: {
        isRemoteEnabled: employeeData.isRemoteEnabled || false,
        currentStatus: 'office', // office, remote, hybrid
        remoteWorkDays: [], // Array of days when working remotely
        lastStatusUpdate: new Date()
      },
      // Additional tracking fields
      attendanceStats: {
        totalLateDays: 0,
        totalAbsentDays: 0,
        totalWorkingDays: 0,
        lastUpdated: new Date()
      }
    }

    const result = await db.collection("employees").insertOne(newEmployee);
    
    return NextResponse.json(
      { message: "Employee created successfully", id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { message: "Error creating employee" },
      { status: 500 }
    );
  }
}