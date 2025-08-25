import { verify } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import clientPromise from "../../../../utils/mongodb";

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

// PUT - Update category
export async function PUT(request, { params }) {
  const auth = await verifyAuth(request);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const { id } = params;
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

    // Check if category exists
    const existingCategory = await collection.findOne({
      _id: new ObjectId(id),
    });
    if (!existingCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    // Check if new name already exists (excluding current category)
    const duplicateCategory = await collection.findOne({
      type,
      name,
      _id: { $ne: new ObjectId(id) },
    });
    if (duplicateCategory) {
      return NextResponse.json(
        { message: "Category name already exists" },
        { status: 400 }
      );
    }

    const updatedCategory = {
      type,
      name,
      subcategories,
      updatedAt: new Date(),
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedCategory }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Category updated successfully",
      category: { ...updatedCategory, _id: id },
    });
  } catch (error) {
    console.error("Error updating category:", error);

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
      { message: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
export async function DELETE(request, { params }) {
  const auth = await verifyAuth(request);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const { id } = params;

    const client = await clientPromise;
    const db = client.db();
    const categoriesCollection = db.collection("categories");
    const expensesCollection = db.collection("expenses");
    const incomeCollection = db.collection("income");

    // Check if category exists
    const existingCategory = await categoriesCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!existingCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category is being used in expenses or income
    const expensesUsingCategory = await expensesCollection.countDocuments({
      category: existingCategory.name,
    });

    const incomeUsingCategory = await incomeCollection.countDocuments({
      category: existingCategory.name,
    });

    if (expensesUsingCategory > 0 || incomeUsingCategory > 0) {
      return NextResponse.json(
        {
          message: `Cannot delete category. It is being used by ${
            expensesUsingCategory + incomeUsingCategory
          } transaction(s).`,
        },
        { status: 400 }
      );
    }

    const result = await categoriesCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);

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
      { message: "Failed to delete category" },
      { status: 500 }
    );
  }
}
