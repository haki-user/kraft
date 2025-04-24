import type { TestCase } from "./problems";
import { SubmissionStatus } from "./submissions";
// export interface TestCase {
//   input: string;
//   expectedOutput: string;
// }

export type Language = "python" | "cpp" | "javascript";

export interface Job {
  id: string;
  code: string;
  language: Language;
  problemId?: string;
  isTestRun: boolean;
  testCases: TestCase[];
}

export interface TestResult {
  id: string;
  inputStr: string;
  input?: Record<string, any>[];
  stdout: string;
  stderr: string;
  expectedOutput: string;
  runtime: number;
  status: SubmissionStatus;
  memoryUsed: number;
}

export interface ExecutionResult {
  input?: Record<string, any>[];
  inputStr?: string;
  output?: string; // ???
  stdout?: string;
  stderr?: string;
  expectedOutput?: string;

  jobId: string;
  status: SubmissionStatus;
  results: TestResult[];
  testCasesPassed: number;
  totalTestCases: number;
  runtime: number;
  memoryUsed: number;
}

export type ExecutorConfig = {
  language: string;
  endpoint: string;
};
