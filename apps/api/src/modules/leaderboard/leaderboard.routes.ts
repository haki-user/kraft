import express from "express";
import type { Router } from "express";
import { getLeaderboardHandler } from "./leaderboard.controller";
import { authMiddleware } from "../auth/auth.middleware";

const router: Router = express.Router();

router.get("/:contestId", authMiddleware, getLeaderboardHandler);

export default router;
