import { v4 as uuidv4 } from "uuid";
import prisma from "../../lib/prisma";
import {
  jobSender,
  processedJobReceiver,
} from "../../lib/azure-service-bus-client";
import { setSubmissionResult } from "./submissions-cache";
import {
  CreateSubmissionDTO,
  ExecuteTestRunDTO,
  Submissions,
  Job,
  Language,
  Submission,
} from "@kraft/types";

/**
 * Creates a submission record with status "PENDING" and pushes a job
 * onto the Service Bus queue so that the code-runner app can process it.
 */
export const createSubmission = async (
  data: CreateSubmissionDTO
): Promise<{ jobId: string }> => {
  const totalTestCases = await prisma.testCase.count({
    where: { problemId: data.problemId },
  });
  // Create submission record with a default PENDING status.
  const submission = await prisma.submission.create({
    data: { ...data, status: "PENDING", totalTestCases },
  });
  // const parsedTestCases = testCasesData.map((testCase) => ({
  //   // redundant -- remove later on.
  //   ...testCase,
  //   input: JSON.parse(testCase.input),
  // }));

  // Build the job payload in a format the code-runner understands.
  const job: Job = {
    id: submission.id,
    code: submission.code,
    problemId: submission.problemId,
    isTestRun: false,
    language: submission.language as Language,
    testCases: [], // Not sending test cases from here due to ASB message size limit. Fetch test cases inside the code runner.
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
};

/**
 * Updates an existing submission record with the result from the code-runner.
 */
export const updateSubmissionResult = async (
  submissionId: string,
  payload: Partial<Submission>
): Promise<void> => {
  await prisma.submission.update({
    where: { id: submissionId },
    data: payload,
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
 * Get submissions for a specific problem by titleSlug.
 */
export const getSubmissionsForProblemByTitleSlug = async ({
  titleSlug,
  contestId,
  userId,
}: {
  titleSlug: string;
  contestId?: string;
  userId?: string;
}): Promise<Submissions> => {
  //TODO: fix this mess from scratch.
  // Fetch the problemId using the titleSlug
  const problem = await prisma.problem.findUnique({
    select: {
      id: true,
    },
    where: { titleSlug },
  });
  if (!problem) {
    throw new Error("Problem not found");
  }
  const submissions = await prisma.submission.findMany({
    where: {
      problemId: problem.id,
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
    memoryUsed: submission.memoryUsed,
    timestamp: submission.createdAt.getTime(),
    totalTestCases: submission.totalTestCases,
    testCasesPassed: submission.testCasesPassed,
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
    memoryUsed: submission.memoryUsed,
    timestamp: submission.createdAt.getTime(),
    totalTestCases: submission.totalTestCases,
    testCasesPassed: submission.testCasesPassed,
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
    memoryUsed: submission.memoryUsed,
    timestamp: submission.createdAt,
  }));
  return tmp;
};

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
        const payload: Partial<Submission> = {
          status: result.status,
          runtime: result.runtime,
          memoryUsed: result.memoryUsed,
          ...(result.input && { input: JSON.stringify(result.input) }),
          ...(result.output && { output: result.output }),
          ...(result.expectedOutput && {
            expectedOutput: result.expectedOutput,
          }),
          ...(result.stderr && { stderr: result.stderr }),
          ...(result.error && { error: result.error }),
          ...(result.testCasesPassed && {
            testCasesPassed: result.testCasesPassed,
          }),
        };
        console.log("---> updateSubmissionResult", jobId, payload);
        await updateSubmissionResult(jobId, payload);
      }
      setSubmissionResult(jobId, result);
      await processedJobReceiver.completeMessage(message);
    },
    processError: async (error) => {
      console.error("Error processing processed job message:", error);
    },
  });
};
