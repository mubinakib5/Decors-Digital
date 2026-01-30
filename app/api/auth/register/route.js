import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  let client;
  try {
    const { username, email, password, name } = await request.json();

    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    client = new MongoClient(process.env.MONGODB_URI);

    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 },
      );
    }

    // Connect to MongoDB
    await client.connect();
    const db = client.db("decors_digital");
    const adminsCollection = db.collection("admins");

    // Check if user already exists
    const existingUser = await adminsCollection.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this username or email already exists" },
        { status: 409 },
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user object
    const newUser = {
      username,
      email,
      name: name || username,
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert user into database
    const result = await adminsCollection.insertOne(newUser);

    // Return success response (without password)
    const userResponse = {
      id: result.insertedId,
      username: newUser.username,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: userResponse,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
