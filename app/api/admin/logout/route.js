import { NextResponse } from "next/server";

// Force dynamic rendering for API routes
export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );

  // Clear the authentication cookie
  response.cookies.delete("admin_token");

  return response;
}
