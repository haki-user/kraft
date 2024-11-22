import { log } from "@kraft/logger";
import dotenv from "dotenv";
import { createServer } from "./server";
import prisma from "./lib/prisma";

dotenv.config();

const port = process.env.PORT || 5001;
const server = createServer();

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Handle uncaught errors
process.on("uncaughtException", async (error) => {
  console.error("Uncaught Exception:", error);
  await prisma.$disconnect();
  process.exit(1);
});

server.listen(port, () => {
  log(`api running on ${port}`);
});
