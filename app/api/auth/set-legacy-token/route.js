import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    // Get the NextAuth token
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token || token.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create legacy JWT token
    const legacyToken = jwt.sign(
      { 
        username: token.username || token.name,
        role: token.role,
        id: token.id
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Create response and set the legacy token cookie
    const response = NextResponse.json({ success: true });
    
    response.cookies.set("admin-token", legacyToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 1 day
      path: "/"
    });

    return response;
  } catch (error) {
    console.error("Error setting legacy token:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}