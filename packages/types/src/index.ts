export type ProblemDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: ProblemDifficulty;
  isPublic: boolean;
  contestId: string | null;
  testCases: TestCase[];
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
  description: string;
  difficulty: ProblemDifficulty;
  isPublic: boolean;
  contestId?: string;
  testCases: TestCase[];
}

export type ProblemUpdateDTO = Omit<Problem, "id" | "testCases">;

export interface CreateTestCasesDTO {
  problemId: string;
  testCases: {
    isPublic: boolean;
    input: string;
    expectedOutput: string;
  }[];
}

export type UpdateTestCaseDTO = Omit<TestCase, "id" | "problemId">;

export * from "./auth";
