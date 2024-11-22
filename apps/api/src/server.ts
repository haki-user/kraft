import express from "express";
import type {
  Express,
} from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/auth.routes";
import { errorHandler } from "./middlewares/errorHandler";

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(cors())
    .use(helmet())
    .use(express.json())
    .use("/api/auth", authRoutes)
    .get("/status", (_, res) => {
      res.json({ ok: true });
    })
    .use(errorHandler);

  return app;
};
