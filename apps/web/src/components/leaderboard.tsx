"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@kraft/ui";
import { fetchLeaderboard } from "@/services/leaderboard-service";

interface LeaderboardParticipant {
  rank: number;
  username: string;
  score: number;
  penalty: number;
  submissionTime: string;
}

const Leaderboard: React.FC<{ contestId: string }> = ({ contestId }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    setIsLoading(true);
    try {
      const response = await fetchLeaderboard(contestId);
      setLeaderboard(response);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [contestId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Contest Leaderboard</h1>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Penalty</TableHead>{" "}
            <TableHead>Submission Time</TableHead>{" "}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <div className="w-full text-center">Loading...</div>
          ) : (
            leaderboard.map((participant) => (
              <TableRow key={participant.rank}>
                <TableCell>{participant.rank}</TableCell>
                <TableCell>{participant.username}</TableCell>
                <TableCell>{participant.score}</TableCell>
                <TableCell>{participant.penalty}</TableCell>{" "}
                {/* Penalty in Seconds */}
                <TableCell>
                  {participant.submissionTime !== "NA"
                    ? new Date(participant.submissionTime).toLocaleString()
                    : "NA"}
                </TableCell>{" "}
                {/* Format submission time */}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Button className="mt-4" onClick={refresh}>
        Refresh Leaderboard
      </Button>
    </div>
  );
};

export default Leaderboard;
