import { z } from "zod";

export const borrowBookSchema = z.object({
  book: z.string().min(1, { message: "Book ID is required" }),
  quantity: z.number().int().min(1, { message: "Quantity must be at least 1" }),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Due date must be a valid date string",
    }),
});
