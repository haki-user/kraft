export type ProblemDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface Problem {
  id: string;
  title: string;
  titleSlug: string;
  description: string;
  difficulty: ProblemDifficulty;
  isPublic: boolean;
  testCases: TestCase[]; // Test cases for this problem
}

export interface TestCase {
  id: string;
  isPublic: boolean;
  input: string;
  problemId: string;
  expectedOutput: string;
}

export interface CreateProblemDTO {
  title: string;
  titleSlug: string;
  description: string;
  difficulty: ProblemDifficulty;
  isPublic: boolean;
  testCases: Omit<TestCase, "id" | "problemId">[]; // Test cases without `id` or `problemId`
}

export type ProblemUpdateDTO = Partial<Omit<Problem, "testCases">>; // Allow updating all fields except test cases

export interface CreateTestCasesDTO {
  problemId: string;
  testCases: Omit<TestCase, "id" | "problemId">[]; // New test cases
}

export interface UpdateTestCaseDTO {
  isPublic?: boolean;
  input?: string;
  expectedOutput?: string;
}
