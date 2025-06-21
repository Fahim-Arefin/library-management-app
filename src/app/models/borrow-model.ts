import { Schema, model } from "mongoose";
import { IBorrow } from "../types";

const borrowSchema = new Schema<IBorrow>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Borrowed book ID is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Borrow = model<IBorrow>("Borrow", borrowSchema);

export default Borrow;
