import { NextResponse } from "next/server";

// Force dynamic rendering for API routes
export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json(
    { message: "HR logged out successfully" },
    { status: 200 }
  );

  // Clear the HR authentication cookie
  response.cookies.set("hr-admin-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}