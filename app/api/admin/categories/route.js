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

// GET - Fetch all categories
export async function GET(request) {
  const auth = await verifyAuth(request);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("categories");

    const categories = await collection
      .find({})
      .sort({ type: 1, name: 1 })
      .toArray();

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);

    // If MongoDB is not available, return empty array for now
    if (
      error.message.includes("MongoParseError") ||
      error.message.includes("ECONNREFUSED")
    ) {
      console.log("MongoDB not available, returning empty categories list");
      return NextResponse.json({ categories: [] });
    }

    return NextResponse.json(
      { message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request) {
  const auth = await verifyAuth(request);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const { type, name, subcategories = [] } = await request.json();

    // Validate input
    if (!type || !name) {
      return NextResponse.json(
        { message: "Type and name are required" },
        { status: 400 }
      );
    }

    if (!["expense", "income"].includes(type)) {
      return NextResponse.json(
        { message: "Type must be either 'expense' or 'income'" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("categories");

    // Check if category already exists
    const existingCategory = await collection.findOne({ type, name });
    if (existingCategory) {
      return NextResponse.json(
        { message: "Category already exists" },
        { status: 400 }
      );
    }

    const newCategory = {
      type,
      name,
      subcategories,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newCategory);

    return NextResponse.json(
      {
        message: "Category created successfully",
        category: { ...newCategory, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);

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
      { message: "Failed to create category" },
      { status: 500 }
    );
  }
}
