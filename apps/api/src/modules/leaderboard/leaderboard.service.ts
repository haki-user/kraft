import prisma from "../../lib/prisma";
import { SubmissionStatus } from "@prisma/client";

/**
 * Get leaderboard for a contest, including submission time and sorted by score
 */
export const getLeaderboard = async (contestId: string) => {
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
              score: true,
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
    const sortedSubmissions = participant.user.submissions;

    let penalty = 0;
    let submissionTime = "NA";
    let totalScore = 0;

    if (sortedSubmissions.length > 0) {
      // Get the first accepted submission time for penalty calculation
      console.log(sortedSubmissions)
      submissionTime = sortedSubmissions[0]?.createdAt?.toISOString() || "NA";

      // Calculate the total score (sum of all accepted submission scores)
      totalScore = sortedSubmissions.reduce(
        (acc, submission) => acc + submission.score,
        0
      );

      // Calculate the penalty as the time difference between contest start and first accepted submission
      const firstAcceptedSubmissionTime = sortedSubmissions[0]?.createdAt;
      const contestStartTime = participant.contest.startTime;

      if (firstAcceptedSubmissionTime) {
        // Penalty in seconds (only if a submission exists)
        penalty = Math.floor(
          (firstAcceptedSubmissionTime.getTime() - contestStartTime.getTime()) /
            (10000 * totalScore)
        );
      }
    }

    return {
      userId: participant.user.id,
      username: participant.user.username,
      score: totalScore,
      penalty: totalScore > 0 ? penalty : 0,
      submissionTime: submissionTime || "NA",
    };
  });
  console.log({leaderboard})

  // Sort by score (descending), then by penalty (ascending)
  leaderboard.sort((a, b) => {
    if (b.score === a.score) {
      return a.penalty - b.penalty; // If scores are equal, rank by submission time (penalty)
    }
    return b.score - a.score; // Rank by score
  });

  // Assign ranks based on sorted leaderboard
  const tmp = leaderboard;
  tmp.forEach((participant, index) => {
    (participant as any).rank = index + 1;
  });
console.log({tmp})
  return tmp;
};
