import prisma from "../../lib/prisma";
import { SubmissionStatus } from "@prisma/client";
import type { LeaderboardParticipant } from "@kraft/types";

/**
 * Get leaderboard for a contest, including submission time and sorted by score
 */
export const getLeaderboard = async (
  contestId: string
): Promise<LeaderboardParticipant[]> => {
  const contestParticipants = await prisma.contestParticipation.findMany({
    where: { contestId },
    include: {
      user: {
        include: {
          submissions: {
            where: {
              contestId,
              status: SubmissionStatus.ACCEPTED,
            },
            orderBy: {
              createdAt: "asc",
            },
            select: {
              // score: true,
              createdAt: true,
            },
          },
        },
      },
      contest: true,
    },
  });

  // Map the contest participants to include their total score, penalty, and rank
  const leaderboard = contestParticipants.map((participant) => {
    const finishTime = participant.endTime || new Date();

    return {
      userId: participant.user.id,
      username: participant.user.username,
      score: participant.score,
      penalty: participant.penalty,
      finishTime,
      rank: 0,
    };
  });

  // Sort by score (descending) considering penalty, then by finish time (ascending)
  leaderboard.sort((a, b) => {
    const scoreA = a.score - a.penalty;
    const scoreB = b.score - b.penalty;
    if (scoreA === scoreB) {
      // a.finishTime - b.finishTime: earlier finish time ranks higher
      return a.finishTime.getTime() - b.finishTime.getTime();
    }
    return scoreB - scoreA;
  });

  // Assign ranks based on sorted leaderboard
  leaderboard.forEach((participant, index) => {
    participant.rank = index + 1;
  });
  return leaderboard;
};
