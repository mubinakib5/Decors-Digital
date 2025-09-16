import { verify } from "jsonwebtoken";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import clientPromise from "../../../utils/mongodb";

// Force dynamic rendering for API routes
export const dynamic = "force-dynamic";

// Middleware to verify authentication (supports both NextAuth and legacy tokens)
async function verifyAuth(request) {
  // First try NextAuth token
  try {
    const nextAuthToken = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (nextAuthToken && nextAuthToken.role === 'admin') {
      return { user: { username: nextAuthToken.name || nextAuthToken.email } };
    }
  } catch (error) {
    // NextAuth token verification failed, continue to legacy token
  }

  // Fallback to legacy token
  const token = request.cookies.get("admin-token")?.value;

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

// GET - Fetch all expenses
export async function GET(request) {
  const auth = await verifyAuth(request);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("expenses");

    const expenses = await collection.find({}).sort({ date: -1 }).toArray();

    return NextResponse.json({ expenses });
  } catch (error) {
    console.error("Error fetching expenses:", error);

    // If MongoDB is not available, return empty array for now
    if (
      error.message.includes("MongoParseError") ||
      error.message.includes("ECONNREFUSED")
    ) {
      console.log("MongoDB not available, returning empty expenses list");
      return NextResponse.json({ expenses: [] });
    }

    return NextResponse.json(
      { message: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

// POST - Create new expense
export async function POST(request) {
  const auth = await verifyAuth(request);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const { date, category, subcategory, company, description, amount, isPaid } =
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

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("expenses");

    const newExpense = {
      date: new Date(date),
      category,
      subcategory: subcategory || "",
      company: company || "",
      description,
      amount: parseFloat(amount),
      isPaid: isPaid !== undefined ? isPaid : true, // Default to true (Paid)
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newExpense);

    return NextResponse.json(
      {
        message: "Expense created successfully",
        expense: { ...newExpense, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating expense:", error);

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
      { message: "Failed to create expense" },
      { status: 500 }
    );
  }
}
