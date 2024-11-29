import { Request, Response } from "express";
import * as submissionsService from "./submissions.service";

/**
 * Create a new submission for a problem.
 */
export const createSubmissionHandler = async (req: Request, res: Response) => {
  const { problemId, contestId, code, language } = req.body;
  const userId = req.user?.id; // Assuming authentication middleware provides `req.user`

  if (!userId) {
    res.sendStatus(400); // fix it later middleware will provide user else middleware will return res error
    return;
  }

  try {
    const submission = await submissionsService.createSubmission({
      userId,
      problemId,
      contestId,
      code,
      language,
    });
    res.status(201).json(submission);
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
  console.log({userId, contestId})

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

/**
 * Execute a test run with custom inputs.
 */
export const executeTestRunHandler = async (req: Request, res: Response) => {
  const { problemId, code, language, testCases } = req.body;

  try {
    const result = await submissionsService.executeTestRun({
      problemId,
      code,
      language,
      testCases,
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.sendStatus(500);
  }
};

// import { Request, Response, NextFunction } from 'express';
// import { SubmissionService, CodeExecutionService } from './submission-types';
// import { SubmissionStatus } from '@prisma/client';

// export const createSubmissionController = (
//   submissionService: ReturnType<typeof createSubmissionService>,
//   codeExecutionService: CodeExecutionService
// ) => ({
//   async createSubmission(req: Request, res: Response, next: NextFunction) {
//     try {
//       const {
//         userId,
//         problemId,
//         code,
//         language,
//         contestId
//       } = req.body;

//       // Optional: Add authentication and authorization checks
//       // 1. Verify user exists
//       // 2. Check problem accessibility
//       // 3. Validate contest participation (if applicable)

//       const submission = await submissionService.createSubmission({
//         userId,
//         problemId,
//         code,
//         language,
//         ...(contestId && { contestId })
//       });

//       res.status(201).json(submission);
//     } catch (error) {
//       next(error);
//     }
//   },

//   async runCodeTest(req: Request, res: Response, next: NextFunction) {
//     try {
//       const {
//         code,
//         language,
//         problemId,
//         customInput
//       } = req.body;

//       // Directly use code execution service without storing submission
//       const result = await codeExecutionService.runCode({
//         code,
//         language,
//         problemId,
//         customInput
//       });

//       res.json(result);
//     } catch (error) {
//       next(error);
//     }
//   },

//   async getSubmissionById(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { id } = req.params;

//       // Optional: Add authorization check

//       const submission = await submissionService.getSubmissionById(id);

//       if (!submission) {
//         return res.status(404).json({ message: 'Submission not found' });
//       }

//       res.json(submission);
//     } catch (error) {
//       next(error);
//     }
//   },

//   async listSubmissions(req: Request, res: Response, next: NextFunction) {
//     try {
//       const {
//         userId,
//         problemId,
//         contestId,
//         status,
//         page = 1,
//         limit = 10
//       } = req.query;

//       // Optional: Add authorization checks

//       const result = await submissionService.listSubmissions({
//         userId: userId as string,
//         problemId: problemId as string,
//         contestId: contestId as string,
//         status: status as SubmissionStatus,
//         page: Number(page),
//         limit: Number(limit)
//       });

//       res.json(result);
//     } catch (error) {
//       next(error);
//     }
//   }
// });
