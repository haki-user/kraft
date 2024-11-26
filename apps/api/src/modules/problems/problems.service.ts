// import { promise } from "zod";
import { ProblemDifficulty } from "@prisma/client";
import prisma from "../../lib/prisma";
import type {
  Problem,
  TestCase,
  CreateProblemDTO,
  CreateTestCasesDTO,
  ProblemUpdateDTO,
  UpdateTestCaseDTO,
} from "@kraft/types";
import test from "node:test";

const getParsedTestCaseInputProblems = (
  problems: (Omit<Problem, "testCases"> & {
    testCases: (Omit<TestCase, "input"> & { input: string })[];
  })[]
): Problem[] => {
  const parsed = problems.map((problem) => {
    return {
      ...problem,
      testCases: problem.testCases.map((testCase) => {
        return {
          ...testCase,
          input: JSON.parse(testCase.input as unknown as string),
        };
      }),
    };
  });
  return parsed;
};

export const getAllProblemsData = async () => {
  const problems = await prisma.problem.findMany({
    select: {
      id: true,
      title: true,
      difficulty: true,
    },
    where: {
      isPublic: true,
    },
  });
  return problems;
};

export const getAllProblemsDataPaginated = async (
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;
  const [problemsData, total] = await Promise.all([
    prisma.problem.findMany({
      select: {
        id: true,
        title: true,
        difficulty: true,
      },
      skip,
      take: limit,
    }),
    prisma.problem.count(),
  ]);
  return { problemsData, total };
};

export const getProblemDataById = async (problemId: string) => {
  const problemData = await prisma.problem.findUnique({
    select: {
      id: true,
      title: true,
      difficulty: true,
    },
    where: {
      id: problemId,
    },
  });
  return problemData;
};

export const getAllProblems = async (): Promise<Problem[]> => {
  const problems = await prisma.problem.findMany({
    where: {
      isPublic: true,
    },
    include: {
      testCases: {
        where: {
          isPublic: true,
        },
      },
    },
  }); // prisma and typescript enums mismatch issue
  return getParsedTestCaseInputProblems(problems);
};

export const getProblemById = async (id: string): Promise<Problem | null> => {
  const problem = await prisma.problem.findUnique({
    where: {
      id,
    },
    include: {
      testCases: {
        where: {
          isPublic: true,
        },
      },
    },
  });
  if (!problem) return null;
  return getParsedTestCaseInputProblems([problem])[0];
};

export const createProblem = async (problem: CreateProblemDTO) => {
  console.log({ problem });
  const newProblem = await prisma.problem.create({
    data: {
      ...problem,
      testCases: {
        create: problem.testCases.map((testCase) => {
          return {
            ...testCase,
            input: JSON.stringify(testCase.input),
          };
        }),
      },
    },
    include: {
      testCases: true,
    },
  });
  return newProblem;
};

export const updateProblemById = async (
  id: string,
  problemData: ProblemUpdateDTO
) => {
  const updatedProblem = await prisma.problem.update({
    where: {
      id,
    },
    data: problemData,
  });
  return updatedProblem;
};

export const deleteProblemById = async (problemId: string) => {
  const problem = await prisma.problem.delete({
    where: {
      id: problemId,
    },
  });
  return problem;
};

export const getAllTestCasesByProblemId = async (
  problemId: string
): Promise<TestCase[]> => {
  const testCases = await prisma.testCase.findMany({
    where: {
      problemId,
    },
  });
  if (!testCases) return [];
  return testCases.map((testCase) => {
    return {
      ...testCase,
      input: JSON.parse(testCase.input as unknown as string),
    };
  });
};

export const getAllPublicTestCasesByProblemId = async (
  problemId: string
): Promise<TestCase[]> => {
  const testCases = await prisma.testCase.findMany({
    where: {
      problemId,
      isPublic: true,
    },
  });
  return testCases.map((testCase) => {
    return {
      ...testCase,
      input: JSON.parse(testCase.input as unknown as string),
    };
  });
};

export const createTestCases = async ({
  problemId,
  testCases,
}: CreateTestCasesDTO) => {
  const data = testCases.map((testCase) => ({
    ...testCase,
    problemId,
    input: JSON.stringify(testCase.input),
  }));
  const newTestCases = await prisma.testCase.createMany({
    data: data,
  });
  return newTestCases;
};

export const updateTestCaseById = async (
  testCaseId: string,
  testCaseData: UpdateTestCaseDTO
) => {
  const updatedTestCase = await prisma.testCase.update({
    where: {
      id: testCaseId,
    },
    data: testCaseData,
  });
  return updatedTestCase;
};

export const deleteTestCaseById = async (testCaseId: string) => {
  const testCase = await prisma.testCase.delete({
    where: {
      id: testCaseId,
    },
  });
  return testCase;
};

export const deleteAllTestCasesByProblemId = async (problemId: string) => {
  const testCases = await prisma.testCase.deleteMany({
    where: {
      problemId,
    },
  });
  return testCases;
};
