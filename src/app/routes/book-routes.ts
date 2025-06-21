import express from "express";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
} from "../controllers/book-controllers";

const bookRouter = express.Router();

bookRouter.post("/", createBook);
bookRouter.get("/", getAllBooks);
bookRouter.get("/:bookId", getBookById);
bookRouter.put("/:bookId", updateBook);
bookRouter.delete("/:bookId", deleteBook);

export default bookRouter;
