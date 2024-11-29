import prisma from "../../lib/prisma"; // Prisma client instance
import {
  CreateSubmissionDTO,
  ExecuteTestRunDTO,
  Submission,
  SubmissionResult,
  TestCase,
  ExecutorResult,
  Submissions,
} from "@kraft/types";
import executor from "./code-execution.service";
import test from "node:test";
import { timeStamp } from "console";

/**
 * Create a new submission for a problem.
 */
export const createSubmission = async ({
  userId,
  problemId,
  contestId,
  code,
  language,
}: CreateSubmissionDTO) => {
  // Save submission in database with PENDING status
  const submission = await prisma.submission.create({
    data: {
      userId,
      problemId,
      contestId,
      code,
      language,
      status: "PENDING",
    },
  });

  const testCases = await prisma.testCase.findMany({
    where: {
      problemId,
    },
  });

  const parsedTestCases = testCases.map((testCase) => {
    return {
      ...testCase,
      input: JSON.parse(testCase.input),
    };
  });

  const executionResult: ExecutorResult = await executor(
    code,
    parsedTestCases,
    false,
    language
  );
  console.log(executionResult);

  // Update submission with execution results
  const updatedSubmission = await prisma.submission.update({
    where: { id: submission.id },
    data: {
      status: executionResult.status,
      runtime: executionResult.runtime,
      memory: executionResult.memoryUsed,
      score: executionResult.results?.every(
        (result) => result.status === "ACCEPTED"
      )
        ? 100
        : 0,
    },
  });

  return updatedSubmission;
};

/**
 * Get a submission by ID.
 */
export const getSubmissionById = async (id: string) => {
  const submission = await prisma.submission.findUnique({
    where: { id },
    include: { problem: true, contest: true, user: true },
  });

  if (!submission) {
    throw new Error("Submission not found");
  }

  return submission;
};

/**
 * Get submissions for a specific problem.
 */
export const getSubmissionsForProblem = async ({
  problemId,
  contestId,
  userId,
}: {
  problemId: string;
  contestId?: string;
  userId?: string;
}): Promise<Submissions> => {
  const submissions = await prisma.submission.findMany({
    where: {
      problemId,
      ...(contestId && { contestId }),
      ...(userId && { userId }),
    },
    include: { user: true, contest: true },
  });

  const transformedSubmissions = submissions.map((submission) => ({
    id: submission.id,
    problemId: submission.problemId,
    userId: submission.userId,
    code: submission.code,
    language: submission.language,
    status: submission.status,
    runtime: submission.runtime,
    memory: submission.memory,
    timestamp: submission.createdAt.getTime(),
  }));

  return {
    submissions: transformedSubmissions,
    totalCount: submissions.length,
    acceptedCount: submissions.filter(
      (submission) => submission.status === "ACCEPTED"
    ).length,
  };
};

/**
 * Get all submissions for a user in a specific contest.
 */
export const getAllUserContestSubmissions = async ({
  contestId,
  userId,
}: {
  contestId: string;
  userId: string;
}) => {
  const submissions = await prisma.submission.findMany({
    where: {
      contestId,
      userId,
    },
    include: {
      problem: true,
    },
  });

  const tmp = submissions.map((submission) => ({
    id: submission.id,
    problemTitle: submission.problem.title,
    code: submission.code,
    language: submission.language,
    status: submission.status,
    runtime: submission.runtime,
    memory: submission.memory,
    timestamp: submission.createdAt,
  }));
  return tmp;
};

/**
 * Execute a test run with custom inputs.
 */
export const executeTestRun = async ({
  problemId,
  code,
  language,
  testCases,
}: ExecuteTestRunDTO): Promise<SubmissionResult> => {
  // const executionResult = await axios.post(
  //   "http://execution-microservice/test-run",
  //   {
  //     problemId,
  //     code,
  //     language,
  //     input,
  //   }
  // );
  const executionResult = await executor(code, testCases, true, language);

  return executionResult;
};

// import { SubmissionStatus } from '@prisma/client';
// import {
//   // SubmissionRepository,
//   SubmissionService,
//   CreateSubmissionDTO,
//   SubmissionQuery,
//   SubmissionResponse,
//   CodeExecutionService
// } from '@kraft/types';

// export const createSubmissionService = (
//   submissionRepository: ReturnType<typeof createSubmissionRepository>,
//   codeExecutionService: CodeExecutionService
// ): SubmissionService => ({
//   async createSubmission(data: CreateSubmissionDTO): Promise<SubmissionResponse> {
//     // 1. Validate problem existence
//     // 2. Check user permissions
//     // 3. Check contest participation (if applicable)

//     // Create initial submission record
//     const submission = await submissionRepository.create(data);

//     try {
//       // Invoke code execution service (AWS Lambda)
//       const executionResult = await codeExecutionService.runCode({
//         code: data.code,
//         language: data.language,
//         problemId: data.problemId
//       });

//       // Update submission status based on execution result
//       return await submissionRepository.updateStatus(
//         submission.id,
//         executionResult.status
//       );
//     } catch (error) {
//       // Handle execution service errors
//       return await submissionRepository.updateStatus(
//         submission.id,
//         'RUNTIME_ERROR'
//       );
//     }
//   },

//   async getSubmissionById(id: string): Promise<SubmissionResponse | null> {
//     return submissionRepository.findById(id);
//   },

//   async listSubmissions(query: SubmissionQuery): Promise<{
//     submissions: SubmissionResponse[];
//     total: number;
//     page: number;
//     limit: number;
//   }> {
//     return submissionRepository.list(query);
//   },

//   async updateSubmissionStatus(
//     id: string,
//     status: SubmissionStatus,
//     score?: number
//   ): Promise<SubmissionResponse> {
//     return submissionRepository.updateStatus(id, status, score);
//   }
// });
