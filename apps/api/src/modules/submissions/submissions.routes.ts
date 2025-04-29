import { Router } from "express";
import * as submissionsController from "./submissions.controller";
import { authMiddleware } from "../auth/auth.middleware";
import {
  testRunRateLimiter,
  submissionRateLimiter,
} from "../../middlewares/rate-limit";

const router: Router = Router();

// Endpoint for creating a new submission.
router.post(
  "/",
  authMiddleware,
  submissionRateLimiter,
  submissionsController.createSubmissionHandler
);

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
  "/problem/title/:titleSlug",
  authMiddleware,
  submissionsController.getSubmissionsForProblemByTitleSlugHandler
);

router.get(
  "/contest/:contestId",
  authMiddleware,
  submissionsController.getAllUserContestSubmissionsHandler
);

router.post(
  "/test-run",
  authMiddleware,
  testRunRateLimiter,
  submissionsController.createTestRunHandler
);

// Endpoint for clients to ping for test run results by jobId.
router.get("/test-run/:jobId", submissionsController.getTestRunResultHandler);

export default router;