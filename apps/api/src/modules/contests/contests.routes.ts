import express from "express";
import type { Router } from "express";
import * as contestsController from "./contests.controller";
import { authMiddleware } from "../auth/auth.middleware";

const router: Router = express.Router();

router.post("/", authMiddleware, contestsController.createContestHandler);
router.get(
  "/",
  authMiddleware,
  contestsController.getAllContestsForUserHandler
);
// router.get("/domain", contestsController.getContestsByDomainHandler);
// router.get("/paginated", contestsController.getPaginatedContestsHandler);
// router.get("/upcoming", contestsController.getUpcomingContestsHandler);
// router.get("/date-range", contestsController.getContestsByDateRangeHandler);
router.get("/:id", contestsController.getContestByIdHandler);
router.get(
  "/:id/problems",
  authMiddleware,
  contestsController.getContestProblemDetailsHandler
);
router.post("/add-problem", contestsController.addProblemToContestHandler);
router.post(
  "/remove-problem",
  contestsController.removeProblemFromContestHandler
);
router.post(
  "/register",
  authMiddleware,
  contestsController.registerUserForContestHandler
);
// router.get(
//   "/created-by/:creatorId",
//   contestsController.getContestsCreatedByUserHandler
// );
// router.get(
//   "/participating/:userId",
//   contestsController.getContestsUserParticipatingHandler
// );
router.put("/:id", contestsController.updateContestHandler);
router.delete("/:id", contestsController.deleteContestHandler);

export default router;
