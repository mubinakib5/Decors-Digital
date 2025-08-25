import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";
import clientPromise from "../../../utils/mongodb";

// Force dynamic rendering for API routes
export const dynamic = "force-dynamic";

// Middleware to verify authentication
async function verifyAuth(request) {
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

// GET - Fetch all income
export async function GET(request) {
  const auth = await verifyAuth(request);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("income");

    const income = await collection.find({}).sort({ date: -1 }).toArray();

    return NextResponse.json({ income });
  } catch (error) {
    console.error("Error fetching income:", error);

    // If MongoDB is not available, return empty array for now
    if (
      error.message.includes("MongoParseError") ||
      error.message.includes("ECONNREFUSED")
    ) {
      console.log("MongoDB not available, returning empty income list");
      return NextResponse.json({ income: [] });
    }

    return NextResponse.json(
      { message: "Failed to fetch income" },
      { status: 500 }
    );
  }
}

// POST - Create new income
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
    const collection = db.collection("income");

    const newIncome = {
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

    const result = await collection.insertOne(newIncome);

    return NextResponse.json(
      {
        message: "Income created successfully",
        income: { ...newIncome, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating income:", error);

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
      { message: "Failed to create income" },
      { status: 500 }
    );
  }
}
