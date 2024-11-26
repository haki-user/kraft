type SubmissionStatus =
  | "PENDING"
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "TIME_LIMIT_EXCEEDED"
  | "MEMORY_LIMIT_EXCEEDED"
  | "RUNTIME_ERROR"
  | "COMPILATION_ERROR";

export interface TestRunRequestDTO {
  problemId: string;
  code: string;
  language: string;
  customInput?: string;
}

export interface TestRunResult {
  status: SubmissionStatus;
  stdout?: string;
  stderr?: string;
  compilationError?: string;
  executionTime?: number;
  memoryUsed?: number;
}

export interface LambdaTestRunService {
  executeTestRun: (data: TestRunRequestDTO) => Promise<TestRunResult>;
}
