import express, { Application, Request, Response } from "express";
import bookRouter from "./app/routes/book-routes";
import { errorHandler } from "./app/middleware/error-handler";
import borrowRouter from "./app/routes/borrow-routes";

const app: Application = express();

// all routes
app.use(express.json());

app.use("/api/books", bookRouter);
app.use("/api/borrow", borrowRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Root Url");
});

// 404 handler (after all routes)
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    error: "Not Found",
  });
});

// Error handler (after 404)
app.use(errorHandler);

export default app;
