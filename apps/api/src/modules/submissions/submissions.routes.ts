import { Router } from "express";
import * as submissionsController from "./submissions.controller";
import { authMiddleware } from "../auth/auth.middleware";

const router: Router = Router();

// Endpoint for creating a new submission.
router.post("/", authMiddleware, submissionsController.createSubmissionHandler);

// Endpoint for clients to ping for submission results by jobId.
router.get(
  "/ping-submission/:jobId", // -- remove it later on... or rename it
  authMiddleware,
  submissionsController.pingSubmissionByJobIdHandler
);

// Endpoint for updating the submission result (called by the code-runner backend). -- Remove it later on...
router.post(
  "/update-result",
  submissionsController.updateSubmissionResultHandler
);

router.get(
  "/:id",
  authMiddleware,
  submissionsController.getSubmissionByIdHandler
);
router.get(
  "/problem/:problemId",
  authMiddleware,
  submissionsController.getSubmissionsForProblemHandler
);
router.get(
  "/contest/:contestId",
  authMiddleware,
  submissionsController.getAllUserContestSubmissionsHandler
);
router.post(
  "/test-run",
  authMiddleware,
  submissionsController.createTestRunHandler
);
// Endpoint for clients to ping for test run results by jobId.
router.get("/test-run/:jobId", submissionsController.getTestRunResultHandler);

export default router;

// import express from "express";
// import { PrismaClient } from "@prisma/client";
// import { createSubmissionRepository } from "./submissions.repository";
// import { createSubmissionService } from "./submissions.service";
// import { createSubmissionController } from "./sumbmissions.controller";
// // import { CodeExecutionService } from "./code-execution.service";

// export const createSubmissionRoutes = (
//   prisma: PrismaClient,
//   codeExecutionService: CodeExecutionService
// ) => {
//   const router = express.Router();

//   // Initialize dependencies
//   const submissionRepository = createSubmissionRepository(prisma);
//   const submissionService = createSubmissionService(
//     submissionRepository,
//     codeExecutionService
//   );
//   const submissionController = createSubmissionController(
//     submissionService,
//     codeExecutionService
//   );

//   // Test run route (no submission storage)
//   router.post("/test-run", (req, res, next) =>
//     submissionController.runCodeTest(req, res, next)
//   );

//   // Submission routes
//   router.post("/", (req, res, next) =>
//     submissionController.createSubmission(req, res, next)
//   );

//   router.get("/:id", (req, res, next) =>
//     submissionController.getSubmissionById(req, res, next)
//   );

//   router.get("/", (req, res, next) =>
//     submissionController.listSubmissions(req, res, next)
//   );

//   return router;
// };
