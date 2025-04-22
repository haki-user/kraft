import type { ExecutorResult } from "@kraft/types";

// Simple in-memory cache for test run results.
const submissionResults: Map<string, ExecutorResult> = new Map();

export const setSubmissionResult = (
  jobId: string,
  result: ExecutorResult
): void => {
  submissionResults.set(jobId, result);
};

export const getSubmissionResult = (
  jobId: string
): ExecutorResult | undefined => {
  return submissionResults.get(jobId);
};

export const deleteSubmissionResult = (jobId: string): void => {
  submissionResults.delete(jobId);
};
