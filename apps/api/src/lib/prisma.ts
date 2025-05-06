import { PrismaClient } from "@prisma/client";
import { config } from "./config";

const prisma = new PrismaClient({
  log: ["info", "warn", "error"],
  errorFormat: "pretty",
  datasources: { db: { url: config.DATABASE_URL } },
});

export default prisma;
