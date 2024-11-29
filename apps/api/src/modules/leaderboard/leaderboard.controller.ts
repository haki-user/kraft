import { Request, Response } from "express";
import * as leaderboardService from "./leaderboard.service";

/**
 * Get the leaderboard for a specific contest
 */
export const getLeaderboardHandler = async (req: Request, res: Response) => {
  const { contestId } = req.params;

  try {
    const leaderboard = await leaderboardService.getLeaderboard(contestId);
    res.status(200).json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve leaderboard" });
  }
};
