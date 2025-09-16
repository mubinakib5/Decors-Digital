import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function POST(request) {
  try {
    const { name, username, email, password } = await request.json();

    // Validation
    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db("decors_digital");
    const adminsCollection = db.collection("admins");

    // Check if admin already exists
    const existingAdmin = await adminsCollection.findOne({
      $or: [{ email }, { username }]
    });

    if (existingAdmin) {
      const field = existingAdmin.email === email ? "email" : "username";
      return NextResponse.json(
        { message: `An admin with this ${field} already exists` },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new admin
    const newAdmin = {
      name,
      username,
      email,
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      isActive: true,
    };

    const result = await adminsCollection.insertOne(newAdmin);

    if (result.insertedId) {
      return NextResponse.json(
        { 
          message: "Admin account created successfully",
          adminId: result.insertedId 
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "Failed to create admin account" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the account" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}