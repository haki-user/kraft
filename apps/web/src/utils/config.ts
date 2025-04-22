const getEnv = (key: string, defaultValue: string) => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const config = {
  API_BASE_URL: getEnv("NEXT_PUBLIC_API_BASE_URL", "http://localhost:5001/api"),
  TEST_RUN_MAX_WAIT_TIME_MS: parseInt(
    getEnv("NEXT_PUBLIC_TEST_RUN_MAX_WAIT_TIME_MS", "180000")
  ),
  SUBMISSION_RUN_WAIT_TIME: parseInt(
    getEnv("NEXT_PUBLIC_SUBMISSION_RUN_WAIT_TIME", "180000")
  ),
};
