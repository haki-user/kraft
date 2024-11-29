import api from "./axios-instance";

interface LeaderboardParticipant {
  rank: number;
  username: string;
  score: number;
  penalty: number;
  submissionTime: string;
}

export const fetchLeaderboard = async (
  contestId: string
): Promise<LeaderboardParticipant[]> => {
  const response = await api.get(`/leaderboard/${contestId}`);
  return response.data;
};
