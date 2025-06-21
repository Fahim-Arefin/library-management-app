import express from "express";
import {
  borrowBook,
  getBorrowSummary,
} from "../controllers/borrow-controllers";

const borrowRouter = express.Router();

borrowRouter.post("/", borrowBook);
borrowRouter.get("/", getBorrowSummary);

export default borrowRouter;
