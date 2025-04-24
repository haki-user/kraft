import { Request, Response } from "express";
import * as submissionsService from "./submissions.service";
import { getSubmissionResult, setSubmissionResult } from "./test-run-cache";

/**
 * Handles submission creation by a user.
 * It creates a pending submission record and pushes a job message.
 */
export const createSubmissionHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { problemId, contestId, code, language } = req.body;
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const { jobId } = await submissionsService.createSubmission({
      userId,
      problemId,
      contestId,
      code,
      language,
    });
    // res.status(201).json(submission);
    res.status(201).json({ jobId });
  } catch (error) {
    console.error("Error creating submission:", error);
    res.status(500).json({ error: "Failed to create submission" });
  }
};

/**
 * Endpoint for the client to ping for the test run result.
 * If the result is not yet available, an HTTP 202 is returned.
 */
export const pingSubmissionByJobIdHandler = (
  req: Request,
  res: Response
): void => {
  const { jobId } = req.params;
  const result = getSubmissionResult(jobId);
  if (result) {
    res.status(200).json({ jobId, result });
  } else {
    res
      .status(202)
      .json({ result: { status: "PENDING" }, message: "Result not ready" });
  }
};

/**
 * Get a submission by ID.
 */
export const getSubmissionByIdHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const submission = await submissionsService.getSubmissionById(id);
    res.status(200).json(submission);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.sendStatus(500);
  }
};

/**
 * Get submissions for a specific problem.
 */
export const getSubmissionsForProblemHandler = async (
  req: Request,
  res: Response
) => {
  const { problemId } = req.params;
  const { contestId, userId } = req.query;

  try {
    const submissions = await submissionsService.getSubmissionsForProblem({
      problemId,
      contestId: contestId as string | undefined,
      userId: userId as string | undefined,
    });
    res.status(200).json(submissions);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.sendStatus(500);
  }
};

/**
 * Get all submissions for a user in a specific contest.
 */
export const getAllUserContestSubmissionsHandler = async (
  req: Request,
  res: Response
) => {
  const { contestId } = req.params; // Contest ID from route params
  const userId = req.user?.id; // Assuming `req.user` is populated by an authentication middleware
  console.log({ userId, contestId });

  if (!userId) {
    res.status(401).json({ error: "Unauthorized. User not logged in." });
    return;
  }

  if (!contestId) {
    res.status(400).json({ error: "Contest ID is required." });
    return;
  }

  try {
    // Fetch all submissions for the user in the specified contest
    const submissions = await submissionsService.getAllUserContestSubmissions({
      contestId,
      userId,
    });

    if (!submissions || submissions.length === 0) {
      res.status(404).json({
        message: "No submissions found for the user in this contest.",
      });
      return;
    }

    res.status(200).json({
      message: "Submissions retrieved successfully.",
      submissions,
    });
  } catch (error) {
    console.error("Error retrieving submissions:", error);

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
};

// /**
//  * Execute a test run with custom inputs.
//  */
// export const executeTestRunHandler = async (req: Request, res: Response) => {
//   const { problemId, code, language, testCases } = req.body;

//   try {
//     const result = await submissionsService.executeTestRun({
//       problemId,
//       code,
//       language,
//       testCases,
//     });
//     res.status(200).json(result);
//   } catch (error) {
//     console.log(error);
//     if (error instanceof Error) {
//       res.status(400).json({ error: error.message });
//       return;
//     }
//     res.sendStatus(500);
//   }
// };

/**
 * Submit a test run job.
 * This endpoint is already in use and returns just the jobId.
 */
export const createTestRunHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { problemId, code, language, testCases } = req.body; // add validations, currently anyone can run test on this problem with just problemId + input validations
    const job = await submissionsService.executeTestRun({
      problemId,
      code,
      language,
      testCases,
    });
    res.status(201).json(job);
  } catch (error) {
    console.error("Error creating test run job:", error);
    res.status(500).json({ error: "Failed to create test run job" });
  }
};

/**
 * Endpoint for the code-runner to push a test run result.
 * The result is cached in-memory.
 */
export const updateTestRunResultHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { jobId, result } = req.body;
  if (!jobId || !result) {
    res.status(400).json({ error: "Invalid payload" });
    return;
  }
  try {
    setSubmissionResult(jobId, result);
    console.log(`Test run result for job ${jobId} received.`);
    res.status(200).json({ message: "Test run result received" });
  } catch (error) {
    console.error("Error updating test run result:", error);
    res.status(500).json({ error: "Failed to update test run result" });
  }
};

/**
 * Endpoint for the client to ping for the test run result.
 * If the result is not yet available, an HTTP 202 is returned.
 */
export const getTestRunResultHandler = (req: Request, res: Response): void => {
  const { jobId } = req.params;
  const result = getSubmissionResult(jobId);
  if (result) {
    res.status(200).json({ jobId, result });
  } else {
    res
      .status(202)
      .json({ result: { status: "PENDING" }, message: "Result not ready" });
  }
};

/**
 * Endpoint for receiving processed job result notifications.
 * The code-runner app (or a webhook) will post the execution result here.
 */
export const updateSubmissionResultHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { submissionId, result } = req.body;
  if (!submissionId || !result) {
    res.status(400).json({ error: "Invalid payload" });
    return;
  }
  try {
    await submissionsService.updateSubmissionResult(submissionId, result);
    res.status(200).json({ message: "Submission result updated successfully" });
  } catch (error) {
    console.error("Error updating submission result:", error);
    res.status(500).json({ error: "Failed to update submission result" });
  }
};
