import type { TestCase } from "./problems";
import type { TestResult } from "./code-runner";

export type SubmissionStatus =
  | "PENDING"
  | "ACCEPTED"
  | "FAILED"
  | "WRONG_ANSWER"
  | "TIME_LIMIT_EXCEEDED"
  | "MEMORY_LIMIT_EXCEEDED"
  | "RUNTIME_ERROR"
  | "COMPILATION_ERROR";

export interface CreateSubmissionDTO {
  userId: string;
  problemId: string;
  contestId?: string;
  code: string;
  language: string;
}

export interface TestRunDTO {
  code: string;
  language: string;
  problemId: string;
  testCases: TestCase[];
}

export interface ExecuteTestRunDTO {
  problemId: string;
  code: string;
  language: string;
  testCases: TestCase[];
}

export interface SubmissionResult {
  status: SubmissionStatus;
  score?: number;
  output?: string;
  error?: string;
  runtime?: number;
  memoryUsed?: number;
  results?: TestResult[];
}

export interface TestRunResult {
  output: string;
  testCase: TestCase;
  runtime: number;
  memoryUsed: number;
  stderr: string;
  status: SubmissionStatus;
}

export interface ExecutorResult {
  input?: Record<string, any>[];
  output?: string;
  stderr?: string;
  expectedOutput?: string;
  error?: string;
  testCasesPassed?: number;
  totalTestCases?: number;
  status: SubmissionStatus;
  memoryUsed: number;
  runtime: number;
  results?: TestResult[];
}

export interface Submissions {
  submissions: Submission[];
  totalCount: number;
  acceptedCount: number;
}

export interface Submission {
  id: string;
  problemId: string;
  userId: string;
  code: string;
  language: string;
  status: SubmissionStatus;
  runtime: number;
  memory: number;
  timestamp: number; // Unix timestamp for better performance
  input?: string;
  output?: string;
  stderr?: string;
  error?: string;
}

// export interface CreateSubmissionDTO {
//   userId: string;
//   problemId: string;
//   code: string;
//   language: string;

//   // Optional contest-specific field
//   contestId?: string;
// }

// export interface SubmissionResponse {
//   id: string;
//   code: string;
//   language: string;
//   userId: string;
//   problemId: string;
//   status: SubmissionStatus;
//   score: number;
//   createdAt: Date;

//   // Optional contest-specific field
//   contestId?: string;
// }

// export interface SubmissionQuery {
//   userId?: string;
//   problemId?: string;
//   contestId?: string;
//   status?: SubmissionStatus;
//   page?: number;
//   limit?: number;
// }

// export interface SubmissionService {
//   createSubmission: (data: CreateSubmissionDTO) => Promise<SubmissionResponse>;
//   getSubmissionById: (id: string) => Promise<SubmissionResponse | null>;
//   listSubmissions: (query: SubmissionQuery) => Promise<{
//     submissions: SubmissionResponse[];
//     total: number;
//     page: number;
//     limit: number;
//   }>;
//   updateSubmissionStatus: (
//     id: string,
//     status: SubmissionStatus,
//     score?: number
//   ) => Promise<SubmissionResponse>;
// }

// export interface CodeExecutionService {
//   // This will be your AWS Lambda service
//   runCode: (params: {
//     code: string;
//     language: string;
//     problemId: string;
//     customInput?: string;
//   }) => Promise<{
//     status: SubmissionStatus;
//     output?: string;
//     error?: string;
//   }>;
// }

// export interface CreateSubmissionDTO {
//   code: string;
//   language: string;
//   userId: string;
//   problemId: string;
//   contestId?: string; // Optional for contest submissions
// }

// export interface TestRunDTO {
//   code: string;
//   language: string;
//   problemId: string;
//   customInput: string; // Custom input provided by the user
// }

// export interface ExecutionResult {
//   status: SubmissionStatus;
//   output: string;
//   error?: string; // Optional error message for failed executions
// }

// submissions.types.ts
