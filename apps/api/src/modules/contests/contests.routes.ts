import express from "express";
import type { Router } from "express";
import * as contestsController from "./contests.controller";

const router: Router = express.Router();

router.post("/", contestsController.createContestHandler);
router.get("/", contestsController.getAllContestsHandler);
router.get("/domain", contestsController.getContestsByDomainHandler);
router.get("/paginated", contestsController.getPaginatedContestsHandler);
router.get("/upcoming", contestsController.getUpcomingContestsHandler);
router.get("/date-range", contestsController.getContestsByDateRangeHandler);
router.get("/:id", contestsController.getContestByIdHandler);
router.post("/add-problem", contestsController.addProblemToContestHandler);
router.post(
  "/remove-problem",
  contestsController.removeProblemFromContestHandler
);
router.post("/register", contestsController.registerUserForContestHandler);
router.get(
  "/created-by/:creatorId",
  contestsController.getContestsCreatedByUserHandler
);
router.get(
  "/participating/:userId",
  contestsController.getContestsUserParticipatingHandler
);
router.put("/:id", contestsController.updateContestHandler);
router.delete("/:id", contestsController.deleteContestHandler);

export default router;
