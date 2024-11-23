// import { promise } from "zod";
import prisma from "../../lib/prisma";
import type {
  Problem,
  TestCase,
  CreateProblemDTO,
  CreateTestCasesDTO,
  ProblemUpdateDTO,
  UpdateTestCaseDTO,
} from "@kraft/types";

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
  return problems;
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
  return problem;
};

export const createProblem = async (problem: CreateProblemDTO) => {
  console.log({ problem });
  const newProblem = await prisma.problem.create({
    data: {
      ...problem,
      testCases: {
        create: problem.testCases,
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
  return testCases;
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
  return testCases;
};

export const createTestCases = async ({
  problemId,
  testCases,
}: CreateTestCasesDTO) => {
  const data = testCases.map((testCase) => ({
    ...testCase,
    problemId,
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
