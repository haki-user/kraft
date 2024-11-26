import express from "express";
import type { Express } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./modules/auth/auth.routes";
import problemsRoutes from "./modules/problems/problems.routes";
import contestsRoutes from "./modules/contests/contests.routes";

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(
      cors({
        origin: ["http://localhost:3002"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Skip-Interceptor"],
      })
    )
    .use(helmet())
    .use(cookieParser())
    .use(express.json())
    .use("/api/auth", authRoutes)
    .use("/api/problems/", problemsRoutes)
    .use("/api/contests", contestsRoutes)
    .get("/status", (_, res) => {
      res.json({ ok: true });
    })
    .use(errorHandler);

  return app;
};
