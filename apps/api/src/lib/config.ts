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
  FRONTEND_URL: process.env.FRONTEND_URL || "",

  DATABASE_URL: getEnv("DATABASE_URL"),

  JWT_SECRET: getEnv("JWT_SECRET"),
  JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "100h"),
  JWT_REFRESH_EXPIRES_IN: getEnv("JWT_REFRESH_EXPIRES_IN", "7d"),

  //   RATE_LIMIT_GENERAL_WINDOW_MS=60000
  // RATE_LIMIT_GENERAL_MAX=100
  // RATE_LIMIT_TEST_RUN_WINDOW_MS=60000
  // RATE_LIMIT_TEST_RUN_MAX=5
  // RATE_LIMIT_SUBMISSION_WINDOW_MS=60000
  // RATE_LIMIT_SUBMISSION_RUN_MAX=2

  RATE_LIMIT_GENERAL_WINDOW_MS: parseInt(
    getEnv("RATE_LIMIT_GENERAL_WINDOW_MS", "60000"),
    10
  ),
  RATE_LIMIT_GENERAL_MAX: parseInt(getEnv("RATE_LIMIT_GENERAL_MAX", "100"), 10),
  RATE_LIMIT_TEST_RUN_WINDOW_MS: parseInt(
    getEnv("RATE_LIMIT_TEST_RUN_WINDOW_MS", "60000"),
    10
  ),
  RATE_LIMIT_TEST_RUN_MAX: parseInt(getEnv("RATE_LIMIT_TEST_RUN_MAX", "5"), 10),
  RATE_LIMIT_SUBMISSION_WINDOW_MS: parseInt(
    getEnv("RATE_LIMIT_SUBMISSION_WINDOW_MS", "60000"),
    10
  ),
  RATE_LIMIT_SUBMISSION_RUN_MAX: parseInt(
    getEnv("RATE_LIMIT_SUBMISSION_RUN_MAX", "2"),
    10
  ),

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
};
