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

// GET - Fetch single employee
export async function GET(request, { params }) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid employee ID" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const employee = await db.collection("employees").findOne({ _id: new ObjectId(id) });
    
    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json(
      { message: "Error fetching employee" },
      { status: 500 }
    );
  }
}

// PUT - Update employee
export async function PUT(request, { params }) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const updateData = await request.json();
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid employee ID" },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = ['name', 'employeeId', 'department', 'designation', 'email', 'phone'];
    for (const field of requiredFields) {
      if (!updateData[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const { db } = await connectToDatabase();
    
    // Check if employee exists
    const existingEmployee = await db.collection("employees").findOne({ _id: new ObjectId(id) });
    if (!existingEmployee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    // Check if employee ID already exists (excluding current employee)
    const duplicateEmployeeId = await db.collection("employees").findOne({ 
      employeeId: updateData.employeeId,
      _id: { $ne: new ObjectId(id) }
    });
    if (duplicateEmployeeId) {
      return NextResponse.json(
        { message: "Employee ID already exists" },
        { status: 400 }
      );
    }

    // Check if email already exists (excluding current employee)
    const duplicateEmail = await db.collection("employees").findOne({ 
      email: updateData.email,
      _id: { $ne: new ObjectId(id) }
    });
    if (duplicateEmail) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    const updatedEmployee = {
      ...updateData,
      updatedAt: new Date()
    };

    const result = await db.collection("employees").updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedEmployee }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: "Employee updated successfully" });
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { message: "Error updating employee" },
      { status: 500 }
    );
  }
}

// DELETE - Delete employee
export async function DELETE(request, { params }) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid employee ID" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Check if employee exists
    const existingEmployee = await db.collection("employees").findOne({ _id: new ObjectId(id) });
    if (!existingEmployee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    // Delete related attendance records
    await db.collection("attendance").deleteMany({ employeeId: id });
    
    // Delete related leave records
    await db.collection("leaves").deleteMany({ employeeId: id });
    
    // Delete employee
    const result = await db.collection("employees").deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { message: "Error deleting employee" },
      { status: 500 }
    );
  }
}