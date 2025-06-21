import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  author: z.string().min(1, { message: "Author is required" }),
  genre: z.enum(
    ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"],
    {
      errorMap: () => ({
        message:
          "Genre must be one of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY",
      }),
    }
  ),
  isbn: z.string().min(1, { message: "ISBN is required" }),
  description: z.string().optional(),
  copies: z
    .number()
    .int()
    .min(0, { message: "Copies must be a non-negative integer" }),
  available: z.boolean().optional(),
});

export const updateBookSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).optional(),
  author: z.string().min(1, { message: "Author is required" }).optional(),
  genre: z
    .enum(
      ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"],
      {
        errorMap: () => ({
          message:
            "Genre must be one of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY",
        }),
      }
    )
    .optional(),
  isbn: z.string().min(1, { message: "ISBN is required" }).optional(),
  description: z.string().optional(),
  copies: z
    .number()
    .int()
    .min(0, { message: "Copies must be a non-negative integer" })
    .optional(),
  available: z.boolean().optional(),
});
