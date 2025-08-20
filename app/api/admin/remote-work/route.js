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

// GET - Fetch remote work status for employees
export async function GET(request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const date = searchParams.get('date');
    
    const { db } = await connectToDatabase();
    
    if (employeeId) {
      // Get specific employee's remote work status
      const employee = await db.collection("employees").findOne(
        { _id: new ObjectId(employeeId) },
        { projection: { name: 1, remoteWorkStatus: 1 } }
      );
      
      if (!employee) {
        return NextResponse.json(
          { message: "Employee not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json(employee);
    } else {
      // Get all employees' remote work status
      const employees = await db.collection("employees").find(
        {},
        { projection: { name: 1, employeeId: 1, department: 1, remoteWorkStatus: 1 } }
      ).toArray();
      
      return NextResponse.json(employees);
    }
  } catch (error) {
    console.error("Error fetching remote work status:", error);
    return NextResponse.json(
      { message: "Error fetching remote work status" },
      { status: 500 }
    );
  }
}

// POST - Update remote work status
export async function POST(request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { employeeId, status, date, reason } = await request.json();
    
    // Validate required fields
    if (!employeeId || !status) {
      return NextResponse.json(
        { message: "Employee ID and status are required" },
        { status: 400 }
      );
    }
    
    if (!ObjectId.isValid(employeeId)) {
      return NextResponse.json(
        { message: "Invalid employee ID" },
        { status: 400 }
      );
    }
    
    // Validate status
    const validStatuses = ['office', 'remote', 'hybrid'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status. Must be: office, remote, or hybrid" },
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
    
    const updateDate = date ? new Date(date) : new Date();
    
    // Update employee's remote work status
    const updateData = {
      "remoteWorkStatus.currentStatus": status,
      "remoteWorkStatus.lastStatusUpdate": new Date(),
      updatedAt: new Date()
    };
    
    // Add to remote work days array if working remotely
    if (status === 'remote' || status === 'hybrid') {
      await db.collection("employees").updateOne(
        { _id: new ObjectId(employeeId) },
        { 
          $set: updateData,
          $addToSet: { "remoteWorkStatus.remoteWorkDays": updateDate.toISOString().split('T')[0] }
        }
      );
    } else {
      await db.collection("employees").updateOne(
        { _id: new ObjectId(employeeId) },
        { $set: updateData }
      );
    }
    
    // Log the remote work status change
    const logEntry = {
      employeeId: employeeId,
      employeeName: employee.name,
      previousStatus: employee.remoteWorkStatus?.currentStatus || 'office',
      newStatus: status,
      date: updateDate,
      reason: reason || '',
      changedBy: 'admin', // Could be enhanced to track which admin made the change
      createdAt: new Date()
    };
    
    await db.collection("remote_work_logs").insertOne(logEntry);
    
    return NextResponse.json(
      { message: "Remote work status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating remote work status:", error);
    return NextResponse.json(
      { message: "Error updating remote work status" },
      { status: 500 }
    );
  }
}

// PUT - Enable/disable remote work for employee
export async function PUT(request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { employeeId, isRemoteEnabled } = await request.json();
    
    if (!employeeId || typeof isRemoteEnabled !== 'boolean') {
      return NextResponse.json(
        { message: "Employee ID and isRemoteEnabled (boolean) are required" },
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
    
    // Update employee's remote work capability
    const result = await db.collection("employees").updateOne(
      { _id: new ObjectId(employeeId) },
      { 
        $set: {
          "remoteWorkStatus.isRemoteEnabled": isRemoteEnabled,
          "remoteWorkStatus.lastStatusUpdate": new Date(),
          updatedAt: new Date()
        }
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: `Remote work ${isRemoteEnabled ? 'enabled' : 'disabled'} for employee` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating remote work capability:", error);
    return NextResponse.json(
      { message: "Error updating remote work capability" },
      { status: 500 }
    );
  }
}