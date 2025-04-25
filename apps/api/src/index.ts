import { log } from "@kraft/logger";
import { createServer } from "./server";
import prisma from "./lib/prisma";
import { config } from "./lib/config";

const port = config.PORT || 5001;
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
