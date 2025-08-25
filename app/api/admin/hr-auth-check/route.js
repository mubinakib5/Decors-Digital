import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Force dynamic rendering for API routes
export const dynamic = "force-dynamic";

// GET - Check HR authentication status
export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("hr-admin-token");

    if (!token) {
      return NextResponse.json({ message: "No HR token found" }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token.value, process.env.JWT_SECRET || "fallback-secret");
      
      // Check if token has HR role
      if (decoded.role !== "hr_admin" || decoded.department !== "human_resource") {
        return NextResponse.json({ message: "Invalid HR token" }, { status: 401 });
      }
      
      return NextResponse.json({ 
        message: "HR Authenticated", 
        status: "success",
        user: {
          username: decoded.username,
          role: decoded.role,
          department: decoded.department
        }
      });
    } catch (error) {
      return NextResponse.json({ message: "Invalid HR token" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error checking HR authentication:", error);
    return NextResponse.json(
      { message: "Error checking HR authentication" },
      { status: 500 }
    );
  }
}