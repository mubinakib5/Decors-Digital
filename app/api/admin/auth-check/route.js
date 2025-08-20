import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Force dynamic rendering for API routes
export const dynamic = "force-dynamic";

// GET - Check authentication status
export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token");

    if (!token) {
      return NextResponse.json({ message: "No token found" }, { status: 401 });
    }

    try {
      jwt.verify(token.value, process.env.JWT_SECRET || "fallback-secret");
      return NextResponse.json({ message: "Authenticated", status: "success" });
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error checking authentication:", error);
    return NextResponse.json(
      { message: "Error checking authentication" },
      { status: 500 }
    );
  }
}
