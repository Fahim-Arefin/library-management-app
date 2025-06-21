import { Request, Response, NextFunction } from "express";

import mongoose from "mongoose";
import Book from "../models/book-model";
import Borrow from "../models/borrow-model";
import { borrowBookSchema } from "../validators/borrow-validation";

export const borrowBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ✅ Zod validation first
    const validatedData = borrowBookSchema.parse(req.body);
    const { book: bookId, quantity, dueDate } = validatedData;

    // ✅ Validate book ID format
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return next({
        statusCode: 400,
        message: "Invalid Book ID",
        error: "The provided ID is not a valid MongoDB ObjectId",
      });
    }

    // ✅ Find the book
    const book = await Book.findById(bookId);
    if (!book) {
      return next({
        statusCode: 404,
        message: "Book not found",
        error: "No book with the given ID",
      });
    }

    // ✅ Check availability
    if (book.copies < quantity) {
      return next({
        statusCode: 400,
        message: "Not enough copies available",
        error: `Only ${book.copies} copies available`,
      });
    }

    // ✅ Deduct quantity
    book.copies -= quantity;

    // ✅ Update availability if copies become 0
    await (Book as any).updateAvailability(book._id, book.copies);

    await book.save();

    // ✅ Create borrow record
    const borrow = await Borrow.create({
      book: bookId,
      quantity,
      dueDate,
    });

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: borrow,
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: "Borrowing failed",
      error,
    });
  }
};

export const getBorrowSummary = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books", // MongoDB collection name (lowercase + plural by default)
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      {
        $project: {
          _id: 0,
          book: {
            title: "$bookDetails.title",
            isbn: "$bookDetails.isbn",
          },
          totalQuantity: 1,
        },
      },
    ]);

    res.json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: summary,
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: "Failed to retrieve borrowed books summary",
      error,
    });
  }
};
