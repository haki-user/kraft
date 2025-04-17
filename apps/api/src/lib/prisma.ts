import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
  datasources: { db: { url: process.env.DATABASE_URL } },
  enableTracing: false,
});

export default prisma;