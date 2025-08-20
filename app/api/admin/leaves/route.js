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

// Helper function to calculate leave days
function calculateLeaveDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end dates
  return daysDiff;
}

// Helper function to check for overlapping leaves
async function checkOverlappingLeaves(db, employeeId, startDate, endDate, excludeLeaveId = null) {
  const query = {
    employeeId: employeeId,
    status: { $in: ['pending', 'approved'] },
    $or: [
      {
        startDate: { $lte: new Date(endDate) },
        endDate: { $gte: new Date(startDate) }
      }
    ]
  };
  
  if (excludeLeaveId) {
    query._id = { $ne: new ObjectId(excludeLeaveId) };
  }
  
  const overlappingLeave = await db.collection("leaves").findOne(query);
  return overlappingLeave;
}

// GET - Fetch all leave records
export async function GET(request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const status = searchParams.get('status');
    const leaveType = searchParams.get('leaveType');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    const { db } = await connectToDatabase();
    
    let query = {};
    
    // Filter by employee ID if provided
    if (employeeId) {
      query.employeeId = employeeId;
    }
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Filter by leave type if provided
    if (leaveType) {
      query.leaveType = leaveType;
    }
    
    // Filter by date range if provided
    if (startDate && endDate) {
      query.$or = [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        }
      ];
    }
    
    const leaves = await db.collection("leaves")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(leaves);
  } catch (error) {
    console.error("Error fetching leaves:", error);
    return NextResponse.json(
      { message: "Error fetching leaves" },
      { status: 500 }
    );
  }
}

// POST - Create new leave request
export async function POST(request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const leaveData = await request.json();
    
    // Validate required fields
    const requiredFields = ['employeeId', 'leaveType', 'startDate', 'endDate', 'reason'];
    for (const field of requiredFields) {
      if (!leaveData[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Validate leave type
    if (!['sick', 'casual', 'annual', 'maternity', 'paternity', 'emergency'].includes(leaveData.leaveType)) {
      return NextResponse.json(
        { message: "Invalid leave type" },
        { status: 400 }
      );
    }
    
    // Validate dates
    const startDate = new Date(leaveData.startDate);
    const endDate = new Date(leaveData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (startDate < today) {
      return NextResponse.json(
        { message: "Start date cannot be in the past" },
        { status: 400 }
      );
    }
    
    if (endDate < startDate) {
      return NextResponse.json(
        { message: "End date cannot be before start date" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Verify employee exists
    const employee = await db.collection("employees").findOne({ _id: new ObjectId(leaveData.employeeId) });
    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }
    
    // Check for overlapping leaves
    const overlappingLeave = await checkOverlappingLeaves(
      db, 
      leaveData.employeeId, 
      leaveData.startDate, 
      leaveData.endDate
    );
    
    if (overlappingLeave) {
      return NextResponse.json(
        { message: "Leave request overlaps with existing leave" },
        { status: 400 }
      );
    }
    
    // Calculate leave days
    const leaveDays = calculateLeaveDays(leaveData.startDate, leaveData.endDate);
    
    // Check leave balance
    const leaveBalanceField = `leaveBalances.${leaveData.leaveType}`;
    const usedLeaveField = `leaveBalances.used${leaveData.leaveType.charAt(0).toUpperCase() + leaveData.leaveType.slice(1)}`;
    
    const availableLeaves = employee[leaveBalanceField] || employee.leaveBalances?.[leaveData.leaveType] || 0;
    const usedLeaves = employee[usedLeaveField] || employee.leaveBalances?.[`used${leaveData.leaveType.charAt(0).toUpperCase() + leaveData.leaveType.slice(1)}`] || 0;
    const remainingLeaves = availableLeaves - usedLeaves;
    
    if (leaveDays > remainingLeaves) {
      return NextResponse.json(
        { 
          message: `Insufficient leave balance. Available: ${remainingLeaves} days, Requested: ${leaveDays} days`,
          availableLeaves: remainingLeaves,
          requestedDays: leaveDays
        },
        { status: 400 }
      );
    }
    
    const newLeave = {
      employeeId: leaveData.employeeId,
      employeeName: employee.name,
      leaveType: leaveData.leaveType,
      startDate: startDate,
      endDate: endDate,
      reason: leaveData.reason,
      leaveDays: leaveDays,
      status: 'pending',
      appliedDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      balanceInfo: {
        availableBeforeLeave: remainingLeaves,
        requestedDays: leaveDays,
        remainingAfterLeave: remainingLeaves - leaveDays
      }
    }

    const result = await db.collection("leaves").insertOne(newLeave);
    
    return NextResponse.json(
      { 
        message: "Leave request submitted successfully", 
        id: result.insertedId,
        leaveDays: leaveDays
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating leave request:", error);
    return NextResponse.json(
      { message: "Error creating leave request" },
      { status: 500 }
    );
  }
}

// PUT - Update leave request (approve/reject or modify)
export async function PUT(request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { leaveId, status, approvedBy, rejectionReason, ...updateData } = await request.json();
    
    if (!leaveId) {
      return NextResponse.json(
        { message: "Leave ID is required" },
        { status: 400 }
      );
    }
    
    if (!ObjectId.isValid(leaveId)) {
      return NextResponse.json(
        { message: "Invalid leave ID" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Find existing leave record
    const leaveRecord = await db.collection("leaves").findOne({ _id: new ObjectId(leaveId) });
    if (!leaveRecord) {
      return NextResponse.json(
        { message: "Leave record not found" },
        { status: 404 }
      );
    }
    
    const updateFields = {
      updatedAt: new Date()
    };
    
    // Handle status updates (approve/reject)
    if (status) {
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return NextResponse.json(
          { message: "Invalid status" },
          { status: 400 }
        );
      }
      
      updateFields.status = status;
      
      if (status === 'approved') {
        updateFields.approvedDate = new Date();
        if (approvedBy) updateFields.approvedBy = approvedBy;
      } else if (status === 'rejected') {
        updateFields.rejectedDate = new Date();
        if (rejectionReason) updateFields.rejectionReason = rejectionReason;
      }
    }
    
    // Handle other field updates
    if (updateData.startDate) {
      updateFields.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      updateFields.endDate = new Date(updateData.endDate);
    }
    if (updateData.reason) {
      updateFields.reason = updateData.reason;
    }
    if (updateData.leaveType) {
      updateFields.leaveType = updateData.leaveType;
    }
    
    // Recalculate leave days if dates changed
    if (updateFields.startDate || updateFields.endDate) {
      const startDate = updateFields.startDate || leaveRecord.startDate;
      const endDate = updateFields.endDate || leaveRecord.endDate;
      updateFields.leaveDays = calculateLeaveDays(startDate, endDate);
      
      // Check for overlapping leaves if dates changed
      const overlappingLeave = await checkOverlappingLeaves(
        db, 
        leaveRecord.employeeId, 
        startDate, 
        endDate,
        leaveId
      );
      
      if (overlappingLeave) {
        return NextResponse.json(
          { message: "Updated leave dates overlap with existing leave" },
          { status: 400 }
        );
      }
    }
    
    // Update leave balance if status is being approved
    if (status === 'approved' && leaveRecord.status !== 'approved') {
      const leaveDays = updateFields.leaveDays || leaveRecord.leaveDays;
      const leaveType = updateFields.leaveType || leaveRecord.leaveType;
      
      // Update employee's used leave balance
      const usedLeaveField = `leaveBalances.used${leaveType.charAt(0).toUpperCase() + leaveType.slice(1)}`;
      
      await db.collection("employees").updateOne(
        { _id: new ObjectId(leaveRecord.employeeId) },
        { 
          $inc: { [usedLeaveField]: leaveDays },
          $set: { 
            "attendanceStats.lastUpdated": new Date(),
            updatedAt: new Date()
          }
        }
      );
    }
    
    // Revert leave balance if status is being rejected after approval
    if (status === 'rejected' && leaveRecord.status === 'approved') {
      const leaveDays = leaveRecord.leaveDays;
      const leaveType = leaveRecord.leaveType;
      
      // Revert employee's used leave balance
      const usedLeaveField = `leaveBalances.used${leaveType.charAt(0).toUpperCase() + leaveType.slice(1)}`;
      
      await db.collection("employees").updateOne(
        { _id: new ObjectId(leaveRecord.employeeId) },
        { 
          $inc: { [usedLeaveField]: -leaveDays },
          $set: { 
            "attendanceStats.lastUpdated": new Date(),
            updatedAt: new Date()
          }
        }
      );
    }
    
    await db.collection("leaves").updateOne(
      { _id: new ObjectId(leaveId) },
      { $set: updateFields }
    );
    
    return NextResponse.json({ message: "Leave request updated successfully" })
  } catch (error) {
    console.error("Error updating leave request:", error);
    return NextResponse.json(
      { message: "Error updating leave request" },
      { status: 500 }
    );
  }
}

// DELETE - Delete leave request
export async function DELETE(request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const leaveId = searchParams.get('leaveId');
    
    if (!leaveId) {
      return NextResponse.json(
        { message: "Leave ID is required" },
        { status: 400 }
      );
    }
    
    if (!ObjectId.isValid(leaveId)) {
      return NextResponse.json(
        { message: "Invalid leave ID" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Check if leave exists
    const leaveRecord = await db.collection("leaves").findOne({ _id: new ObjectId(leaveId) });
    if (!leaveRecord) {
      return NextResponse.json(
        { message: "Leave record not found" },
        { status: 404 }
      );
    }
    
    // Only allow deletion of pending leaves
    if (leaveRecord.status !== 'pending') {
      return NextResponse.json(
        { message: "Only pending leave requests can be deleted" },
        { status: 400 }
      );
    }
    
    const result = await db.collection("leaves").deleteOne({ _id: new ObjectId(leaveId) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Leave record not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: "Leave request deleted successfully" });
  } catch (error) {
    console.error("Error deleting leave request:", error);
    return NextResponse.json(
      { message: "Error deleting leave request" },
      { status: 500 }
    );
  }
}