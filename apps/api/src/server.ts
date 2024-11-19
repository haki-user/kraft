import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { log } from "@kraft/logger";

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(cors())
    .use(helmet())
    .use(express.json())
    .get("/status", (_, res) => {
      res.json({ ok: true });
    });

  // Global Error Handler
  app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
    log(err);
    res.status(500).json({
      message: "Something went wrong",
      error: process.env.NODE_ENV === "development" ? err.message : {},
    });
  });

  return app;
};
