import { Prisma } from "@prisma/client";
import type {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle Prisma specific errors
    switch (error.code) {
      case "P2002":
        res.status(409).json({
          error: "Unique constraint violation",
        });
        return;
      default:
        res.status(500).json({
          error: "Database error",
        });
        return;
    }
  }

  // Handle other errors
  res.status(500).json({
    error: "Internal server error",
  });
};
