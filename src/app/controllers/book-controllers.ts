import { Request, Response, NextFunction } from "express";
import Book from "../models/book-model";
import {
  createBookSchema,
  updateBookSchema,
} from "../validators/book-validator";
import mongoose from "mongoose";

// Create Book
export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ✅ Validate with Zod first
    const validatedData = createBookSchema.parse(req.body);

    // ✅ Then save to DB
    const book = await Book.create(validatedData);
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error: any) {
    // Zod error
    if (error.name === "ZodError") {
      return next({
        statusCode: 400,
        message: "Request validation failed",
        error: error.errors,
      });
    }

    // Mongoose duplicate key error
    if (error.code === 11000) {
      return next({
        statusCode: 400,
        message: "Duplicate value for: isbn",
        error,
      });
    }

    // Mongoose validation or other error
    next({
      statusCode: 400,
      message: "Validation failed",
      error,
    });
  }
};

// get all books
export const getAllBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      filter,
      sortBy = "createdAt",
      sort = "desc",
      limit = "10",
    } = req.query;

    const query: any = {};
    if (filter) {
      query.genre = filter;
    }

    const sortOrder = sort === "desc" ? -1 : 1;

    const books = await Book.find(query).sort({
      [sortBy as string]: sortOrder,
    });
    // .limit(parseInt(limit as string, 10));

    res.json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: "Failed to retrieve books",
      error,
    });
  }
};

export const getBookById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);

    if (!book) {
      return next({
        statusCode: 404,
        message: "Book not found",
        error: "No book with the given ID",
      });
    }

    res.json({
      success: true,
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: "Failed to retrieve book",
      error,
    });
  }
};

export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ✅ Validate update data
    const validatedData = updateBookSchema.parse(req.body);

    const { bookId } = req.params;

    const book = await Book.findByIdAndUpdate(bookId, validatedData, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return next({
        statusCode: 404,
        message: "Book not found",
        error: "No book with the given ID",
      });
    }

    res.json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return next({
        statusCode: 400,
        message: "Duplicate value for: isbn",
        error,
      });
    }

    next({
      statusCode: 400,
      message: "Validation failed",
      error,
    });
  }
};

export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookId } = req.params;

    // Optional: Validate the bookId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return next({
        statusCode: 400,
        message: "Invalid Book ID",
        error: "The provided ID is not a valid MongoDB ObjectId",
      });
    }

    //  Attempt deletion
    const book = await Book.findByIdAndDelete(bookId);

    if (!book) {
      return next({
        statusCode: 404,
        message: "Book not found",
        error: "No book with the given ID",
      });
    }

    res.json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: "Failed to delete book",
      error,
    });
  }
};
