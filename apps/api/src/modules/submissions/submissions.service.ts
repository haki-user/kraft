import { v4 as uuidv4 } from "uuid";
import prisma from "../../lib/prisma";
import {
  jobSender,
  processedJobReceiver,
} from "../../lib/azure-service-bus-client";
import { setSubmissionResult } from "./test-run-cache";
import {
  CreateSubmissionDTO,
  ExecuteTestRunDTO,
  // Submission,
  // SubmissionResult,
  // TestCase,
  // ExecutorResult,
  Submissions,
  Job,
  Language,
  SubmissionStatus,
} from "@kraft/types";
// import executor from "./code-execution.service";
// import test from "node:test";
// import { timeStamp } from "console";

/**
 * Creates a submission record with status "PENDING" and pushes a job
 * onto the Service Bus queue so that the code-runner app can process it.
 */
export const createSubmission = async (
  data: CreateSubmissionDTO
): Promise<{ jobId: string }> => {
  // Create submission record with a default PENDING status.
  const submission = await prisma.submission.create({
    data: { ...data, status: "PENDING" },
  });
  const testCasesData = await prisma.testCase.findMany({
    where: { problemId: submission.problemId },
  });
  const parsedTestCases = testCasesData.map((testCase) => ({
    // redundant -- remove later on.
    ...testCase,
    input: JSON.parse(testCase.input),
  }));

  // Build the job payload in a format the code-runner understands.
  const job: Job = {
    id: submission.id,
    code: submission.code,
    isTestRun: false,
    language: submission.language as Language,
    testCases: parsedTestCases, // Optionally load test cases from your DB if needed.
  };

  try {
    // Push the job into the Service Bus queue.
    await jobSender.sendMessages({
      body: job,
      subject: "JobSubmission",
    });
    console.log(`Job ${job.id} submitted to queue.`);
    return { jobId: job.id };
  } catch (error) {
    console.error("Failed to push job to queue", error);
    // Optionally, update submission status if the job could not be queued.
    await prisma.submission.update({
      where: { id: submission.id },
      data: { status: "FAILED" },
    });
    throw error;
  }
  // return {
  // id: submission.id,
  // status: submission.status,
  // problemId: submission.problemId,
  // language: submission.language,
  // };
};

/**
 * Updates an existing submission record with the result from the code-runner.
 */
export const updateSubmissionResult = async (
  submissionId: string,
  result: {
    status:
      | "ACCEPTED"
      | "WRONG_ANSWER"
      | "RUNTIME_ERROR"
      | "TIME_LIMIT_EXCEEDED"
      | string;
    score?: number;
    runtime?: number;
    memoryUsed?: number;
    output?: string;
    error?: string;
  }
): Promise<void> => {
  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: result.status as SubmissionStatus,
      score: result.score || 0,
      runtime: result.runtime,
      memory: result.memoryUsed,
      output: result.output,
      error: result.error,
    },
  });
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

// /**
//  * Execute a test run with custom inputs.
//  */
// export const executeTestRun = async ({
//   problemId,
//   code,
//   language,
//   testCases,
// }: ExecuteTestRunDTO): Promise<ExecutorResult> => {
//   // const executionResult = await axios.post(
//   //   "http://execution-microservice/test-run",
//   //   {
//   //     problemId,
//   //     code,
//   //     language,
//   //     input,
//   //   }
//   // );
//   const executionResult = await executor(code, testCases, true, language);

//   return executionResult;
// };

/**
 * Execute a test run with custom inputs.
 * The job is pushed to the Code Runner queue with the isTestRun flag.
 * The API returns a jobId and does not wait for or store the result.
 */
export const executeTestRun = async ({
  problemId,
  code,
  language,
  testCases,
}: ExecuteTestRunDTO): Promise<{ jobId: string }> => {
  const jobId = uuidv4();

  const job = {
    id: jobId,
    code,
    language,
    problemId,
    testCases,
    isTestRun: true,
  };

  try {
    await jobSender.sendMessages({
      body: job,
      subject: "JobSubmission",
    });
    console.log(`Test run job ${jobId} submitted to queue.`);
  } catch (error) {
    console.error("Failed to push test run job to queue", error);
    throw error;
  }
  return { jobId };
};

/**
 * Listens for processed test run results coming from the Code Runner via the processed jobs queue.
 * Once a result is received the in-memory cache is updated.
 */
export const processProcessedJobs = (): void => {
  processedJobReceiver.subscribe({
    processMessage: async (message) => {
      const { jobId, result, isTestRun } = message.body as {
        jobId: string;
        result: any;
        isTestRun: boolean;
      };
      console.log(
        `Processed job result received for job ${jobId}, result:`,
        result,
        { isTestRun }
      );
      if (!isTestRun) {
        await updateSubmissionResult(jobId, {
          status: result.status,
          score: result.score,
          runtime: result.runtime,
          memoryUsed: result.memoryUsed,
          output: result.output,
          error: result.error,
        });
      }
      setSubmissionResult(jobId, result);
      await processedJobReceiver.completeMessage(message);
    },
    processError: async (error) => {
      console.error("Error processing processed job message:", error);
    },
  });
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
