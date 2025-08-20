import { connectToDatabase } from "@/app/utils/mongodb";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Check authentication
async function checkAuth(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin-token')?.value;
    
    if (!token) {
      return false;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return decoded.role === 'admin';
  } catch (error) {
    return false;
  }
}

// POST - Update attendance status from 'present' to 'on time'
export async function POST(request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db } = await connectToDatabase();
    
    // Update all records with status 'present' to 'on time'
    const result = await db.collection("attendance").updateMany(
      { status: 'present' },
      { $set: { status: 'on time' } }
    );

    return NextResponse.json({
      message: `Updated ${result.modifiedCount} attendance records from 'present' to 'on time'`,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Error updating attendance records:', error);
    return NextResponse.json(
      { message: "Error updating attendance records", error: error.message },
      { status: 500 }
    );
  }
}