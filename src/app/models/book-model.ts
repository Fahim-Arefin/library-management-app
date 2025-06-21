import { Schema, model } from "mongoose";
import { Book } from "../types";
import Borrow from "./borrow-model";

const bookSchema = new Schema<Book>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      enum: {
        values: [
          "FICTION",
          "NON_FICTION",
          "SCIENCE",
          "HISTORY",
          "BIOGRAPHY",
          "FANTASY",
        ],
        message:
          "Genre must be one of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY",
      },
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
    },
    description: {
      type: String,
    },
    copies: {
      type: Number,
      required: [true, "Number of copies is required"],
      min: [0, "Copies must be a non-negative number"],
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Inside your schema before exporting
bookSchema.statics.updateAvailability = async function (
  bookId: string,
  copies: number
) {
  const isAvailable = copies > 0;
  await this.findByIdAndUpdate(bookId, { available: isAvailable });
};

bookSchema.pre("findOneAndDelete", async function (next) {
  const bookId = this.getQuery()._id;

  if (bookId) {
    await Borrow.deleteMany({ book: bookId });
    console.log(`Deleted all borrow records for book ID: ${bookId}`);
  }

  next();
});

const Book = model<Book>("Book", bookSchema);

export default Book;
