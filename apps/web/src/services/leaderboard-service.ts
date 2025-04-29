import api from "./axios-instance";
import { LeaderboardParticipant } from "@kraft/types";

export const fetchLeaderboard = async (
  contestId: string
): Promise<LeaderboardParticipant[]> => {
  const response = await api.get(`/leaderboard/${contestId}`);
  return response.data;
};
