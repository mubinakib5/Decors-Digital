import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  let client;
  try {
    const { token, password } = await request.json();

    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 },
      );
    }

    const uri = process.env.MONGODB_URI;
    client = new MongoClient(uri);

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 },
      );
    }

    await client.connect();
    const db = client.db("decors_digital");
    const adminsCollection = db.collection("admins");
    const usersCollection = db.collection("users");

    // Find admin with this reset token
    const admin = await adminsCollection.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }, // Token must not be expired
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Invalid or expired reset token" },
        { status: 400 },
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update the admin's password in admins collection and remove reset token
    await adminsCollection.updateOne(
      { _id: admin._id },
      {
        $set: {
          password: hashedPassword,
        },
        $unset: {
          resetToken: "",
          resetTokenExpiry: "",
        },
      },
    );

    // Also update the password in users collection if the user exists there
    // This ensures consistency between both collections for authentication
    const userInUsersCollection = await usersCollection.findOne({
      $or: [{ email: admin.email }, { username: admin.username }],
    });

    if (userInUsersCollection) {
      await usersCollection.updateOne(
        { _id: userInUsersCollection._id },
        {
          $set: {
            password: hashedPassword,
          },
        },
      );
      console.log(
        "Password updated in both admins and users collections for:",
        admin.email,
      );
    } else {
      console.log(
        "Password updated only in admins collection for:",
        admin.email,
      );
    }

    return NextResponse.json(
      { message: "Password has been successfully reset" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { message: "An error occurred while resetting the password" },
      { status: 500 },
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
