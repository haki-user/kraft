export const config = {
  API_BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/api",
  TEST_RUN_MAX_WAIT_TIME_MS: parseInt(
    process.env.NEXT_PUBLIC_TEST_RUN_MAX_WAIT_TIME_MS || "180000"
  ),
  SUBMISSION_RUN_WAIT_TIME: parseInt(
    process.env.NEXT_PUBLIC_SUBMISSION_RUN_WAIT_TIME || "180000"
  ),
  SUPPORTED_LANGUAGES: (
    process.env.NEXT_PUBLIC_SUPPORTED_LANGUAGES || ""
  ).split(","),
  DEFAULT_ACTIVE_LANGUAGE: process.env.NEXT_PUBLIC_DEFAULT_ACTIVE_LANGUAGE || "python",
};
