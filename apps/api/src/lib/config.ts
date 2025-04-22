import dotenv from "dotenv";

dotenv.config();

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const config = {
  PORT: getEnv("PORT", "5001"),
  DATABASE_URL: getEnv("DATABASE_URL"),
  JWT_SECRET: getEnv("JWT_SECRET"),
  JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
  AZURE_SERVICE_BUS_CONNECTION_STRING: getEnv(
    "AZURE_SERVICE_BUS_CONNECTION_STRING"
  ),
  AZURE_SERVICE_BUS_JOBS_QUEUE_NAME: getEnv(
    "AZURE_SERVICE_BUS_JOBS_QUEUE_NAME"
  ),
  AZURE_SERVICE_BUS_PROCESSED_JOBS_QUEUE_NAME: getEnv(
    "AZURE_SERVICE_BUS_PROCESSED_JOBS_QUEUE_NAME",
    ""
  ),
  FRONTEND_URL: process.env.FRONTEND_URL || "",
};
