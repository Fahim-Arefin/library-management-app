import { Types } from "mongoose";

export type Book = {
  title: string;
  author: string;
  genre:
    | "FICTION"
    | "NON_FICTION"
    | "SCIENCE"
    | "HISTORY"
    | "BIOGRAPHY"
    | "FANTASY";
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
};

export type IBorrow = {
  book: Types.ObjectId;
  quantity: number;
  dueDate: Date;
};
