import api from "./axios-instance";
import {
  CreateSubmissionDTO,
  Submissions,
  SubmissionResult,
  TestRunDTO,
} from "@kraft/types";
// import { SubmissionStatus, TestRunResult } from "@kraft/types";
import { ExecutorResult } from "@kraft/types";

export const createSubmission = async (
  data: Omit<CreateSubmissionDTO, "userId">
): Promise<SubmissionResult> => {
  const res = await api.post<{ jobId: string }>("/submissions/", data);

  const maxWaitTime =
    Number(process.env.NEXT_PUBLIC_SUBMISSION_RUN_WAIT_TIME) || 2 * 60 * 1000;
  const initialInterval = 1000; // Start with 1s
  let currentInterval = initialInterval;
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    const result = await pingSubmissionByJobId(res.data.jobId);
    if (result.status !== "PENDING") {
      return result;
    }

    // Exponential backoff with jitter
    const jitter = currentInterval * Math.random() * 0.5;
    await new Promise((resolve) =>
      setTimeout(resolve, currentInterval + jitter)
    );
    currentInterval = Math.min(currentInterval * 2, 10000); // Cap at 10s
  }

  throw new Error("Submission timed out after 2 minutes");
};

export const pingSubmissionByJobId = async (jobId: string) => {
  const response = await api.get<{ jobId: string; result: SubmissionResult }>(
    `/submissions/ping-submission/${jobId}`
  );
  return response.data.result;
};

export const getSubmissionById = async (
  id: string
): Promise<SubmissionResult> => {
  const response = await api.get<SubmissionResult>(`/submissions/${id}`);
  return response.data;
};

export const getSubmissionsForProblem = async (
  problemId: string,
  contestId?: string
): Promise<Submissions> => {
  const response = await api.get<Submissions>(
    `/submissions/problem/${problemId}`,
    {
      params: { contestId },
    }
  );
  return response.data;
};

export const getAllUserContestSubmissions = async (
  contestId: string
): Promise<Submissions> => {
  const response = await api.get<Submissions>(
    `/submissions/contest/${contestId}`
  );
  return response.data;
};

export const executeTestRun = async (
  data: TestRunDTO
): Promise<ExecutorResult> => {
  const res = await api.post<{ jobId: string }>("/submissions/test-run", data);

  const maxWaitTime =
    Number(process.env.NEXT_PUBLIC_TEST_RUN_MAX_WAIT_TIME_MS) || 60000;
  const initialInterval = 500; // Start with 0.5s
  let currentInterval = initialInterval;
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    const result = await getTestRunResult(res.data.jobId);
    if (result.status !== "PENDING") {
      return result;
    }

    // Exponential backoff with jitter
    const jitter = currentInterval * Math.random() * 0.5; // Add randomness
    await new Promise((resolve) =>
      setTimeout(resolve, currentInterval + jitter)
    );
    currentInterval = Math.min(currentInterval * 2, 5000); // Cap at 5s
  }

  throw new Error(`Test run timed out after ${maxWaitTime / 1000} seconds`);
};

export const getTestRunResult = async (
  jobId: string
): Promise<ExecutorResult> => {
  const response = await api.get<{
    result: ExecutorResult & { stdout?: string };
  }>(`/submissions/test-run/${jobId}`);
  const data = response.data.result;
  if (data.stdout) data.output = data.stdout;
  return data;
};
