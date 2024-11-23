import { Router } from "express";
import {
  getAllProblemsDataPaginated,
  // GetProblemDataById,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
  getAllTestCases,
  getAllPublicTestCases,
  createTestCases,
  updateTestCase,
  deleteAllTestCases,
  deleteTestCase,
} from "./problems.controller";
import { authMiddleware, roleGuard } from "../auth/auth.middleware";

const router: Router = Router();

router.use(authMiddleware);

// Todo: Add zod validation

router.get("/", getAllProblemsDataPaginated);
router.get("/:problemId", getProblemById);
router.post("/", roleGuard("ADMIN", "ORGANIZER"), createProblem);
router.put("/:problemId", roleGuard("ADMIN"), updateProblem);
router.delete("/:problemId", roleGuard("ADMIN"), deleteProblem);
router.get("/:problemId/test-cases", roleGuard("ADMIN"), getAllTestCases);
router.get("/:problemId/public-test-cases", getAllPublicTestCases);
router.post(
  "/:problemId/test-cases",
  roleGuard("ADMIN", "ORGANIZER"),
  createTestCases
);
router.put("/:problemId/test-cases", roleGuard("ADMIN"), updateTestCase);
router.delete("/:problemId/test-cases", roleGuard("ADMIN"), deleteAllTestCases);
router.delete("/test-case/:testCaseId", roleGuard("ADMIN"), deleteTestCase);

export default router;
