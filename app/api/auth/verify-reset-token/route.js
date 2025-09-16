import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db("decors_digital");
    const adminsCollection = db.collection("admins");

    // Find admin with this reset token
    const admin = await adminsCollection.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }, // Token must not be expired
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Token is valid" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { message: "An error occurred while verifying the token" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}