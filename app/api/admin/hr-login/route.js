import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Force dynamic rendering for API routes
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    // Check credentials against HR-specific environment variables
    const hrUsername = process.env.HR_USERNAME || "hr_admin";
    const hrPassword = process.env.HR_PASSWORD || "hr_password123";

    if (!hrUsername || !hrPassword) {
      console.error(
        "HR credentials not configured in environment variables"
      );
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Compare username
    if (username !== hrUsername) {
      return NextResponse.json(
        { message: "Invalid HR credentials" },
        { status: 401 }
      );
    }

    // Compare password
    const isPasswordValid =
      (await bcrypt.compare(password, hrPassword)) ||
      password === hrPassword;

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid HR credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token with HR role
    const token = jwt.sign(
      { username, role: "hr_admin", department: "human_resource" },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    // Create response with cookie
    const response = NextResponse.json(
      { message: "HR Login successful", token },
      { status: 200 }
    );

    // Set HTTP-only cookie with proper options for HR
    response.cookies.set("hr-admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("HR Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}