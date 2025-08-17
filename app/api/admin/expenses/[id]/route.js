import { verify } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import clientPromise from "../../../../utils/mongodb";

// Force dynamic rendering for API routes
export const dynamic = "force-dynamic";

// Middleware to verify authentication
async function verifyAuth(request) {
  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    return { error: "No token provided", status: 401 };
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.username) {
      return { error: "Invalid token", status: 401 };
    }
    return { user: decoded };
  } catch (error) {
    return { error: "Invalid token", status: 401 };
  }
}

// PUT - Update expense
export async function PUT(request, { params }) {
  const auth = await verifyAuth(request);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const { id } = await params;
    const { date, category, subcategory, description, amount } =
      await request.json();

    // Validate input
    if (!date || !category || !description || amount === undefined) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { message: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid expense ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("expenses");

    const updatedExpense = {
      date: new Date(date),
      category,
      subcategory: subcategory || "",
      description,
      amount: parseFloat(amount),
      updatedAt: new Date(),
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedExpense }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Expense not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Expense updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating expense:", error);

    // If MongoDB is not available, return a helpful message
    if (
      error.message.includes("MongoParseError") ||
      error.message.includes("ECONNREFUSED")
    ) {
      return NextResponse.json(
        {
          message:
            "Database not available. Please check your MongoDB connection.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { message: "Failed to update expense" },
      { status: 500 }
    );
  }
}

// DELETE - Delete expense
export async function DELETE(request, { params }) {
  const auth = await verifyAuth(request);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const { id } = await params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid expense ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("expenses");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Expense not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Expense deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting expense:", error);

    // If MongoDB is not available, return a helpful message
    if (
      error.message.includes("MongoParseError") ||
      error.message.includes("ECONNREFUSED")
    ) {
      return NextResponse.json(
        {
          message:
            "Database not available. Please check your MongoDB connection.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { message: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
