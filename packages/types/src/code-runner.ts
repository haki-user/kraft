import type { TestCase } from "./problems";
// export interface TestCase {
//   input: string;
//   expectedOutput: string;
// }

export interface Job {
  id: string;
  code: string;
  language: "python" | "cpp" | "javascript";
  testCases: TestCase[];
}

export interface TestResult {
  input: string;
  stdout: string;
  stderr: string;
  expectedOutput: string;
  passed: boolean;
  runtime: number;
  memory: number;
}

export interface ExecutionResult {
  jobId: string;
  status: "success" | "compile_error" | "runtime_error" | "timeout";
  results: TestResult[];
  totalPassed: number;
  totalCases: number;
  averageRuntime: number;
  maxMemory: number;
}

export type ExecutorConfig = {
  language: string;
  endpoint: string;
};
