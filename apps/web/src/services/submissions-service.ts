import api from "./axios-instance";
import {
  CreateSubmissionDTO,
  Submissions,
  SubmissionResult,
  TestRunDTO,
} from "@kraft/types";
import { SubmissionStatus, TestRunResult } from "@kraft/types";

interface ExecutorResult {
  input?: string;
  output?: string;
  expectedOutput?: string;
  error?: string;
  testCasesPassed?: number;
  totalTestCases?: number;
  status: SubmissionStatus;
  memoryUsed: number;
  runtime: number;
  results?: TestRunResult[];
}

export const createSubmission = async (
  data: Omit<CreateSubmissionDTO, "userId">
): Promise<SubmissionResult> => {
  const response = await api.post<SubmissionResult>("/submissions/", data);
  return response.data;
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
  const response = await api.post<ExecutorResult>(
    "/submissions/test-run",
    data
  );
  return response.data;
};
