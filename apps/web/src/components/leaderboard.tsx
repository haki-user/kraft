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
  Skeleton,
} from "@kraft/ui";
import { fetchLeaderboard } from "@/services/leaderboard-service";
import type { Contest } from "@kraft/types";

interface LeaderboardParticipant {
  rank: number;
  username: string;
  score: number;
  penalty: number;
  submissionTime: string;
}

const Leaderboard: React.FC<{ contestId: string; contestDetails: Contest }> = ({
  contestId,
  contestDetails,
}) => {
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
            <TableHead>Penalty</TableHead> <TableHead>Time Taken</TableHead>{" "}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? [1, 2].map((idx) => (
                <TableRow id={String(idx)}>
                  <TableCell>
                    <Skeleton className={`w-${idx}/2 h-4 my-0.5`} />
                  </TableCell>
                  <TableCell>
                    <Skeleton className={`w-1/${2 * idx} h-4 my-0.5`} />
                  </TableCell>
                  <TableCell>
                    <Skeleton className={`w-1/${2 * idx} h-4 my-0.5`} />
                  </TableCell>
                  <TableCell>
                    <Skeleton className={`w-[${40 * idx}%] h-4 my-0.5`} />
                  </TableCell>
                  <TableCell>
                    <Skeleton className={`w-1/${2 * idx} h-4 my-0.5`} />
                  </TableCell>
                </TableRow>
              ))
            : leaderboard.map((participant) => (
                <TableRow key={participant.rank}>
                  <TableCell>{participant.rank}</TableCell>
                  <TableCell>{participant.username}</TableCell>
                  <TableCell>{participant.score}</TableCell>
                  <TableCell>{participant.penalty}</TableCell>{" "}
                  {/* Penalty in Seconds */}
                  <TableCell>
                    {participant.submissionTime !== "NA"
                      ? // ? contestDetails.startTime - new Date(participant.submissionTime).toLocaleString()
                        // time taken in hh:mm:ss format
                        new Date(
                          new Date(participant.submissionTime).getTime() -
                            // new Date(1741949346108).getTime() -
                            // new Date(1741949286108).getTime()
                            new Date(contestDetails.startTime).getTime()
                        )
                          .toISOString()
                          .substr(11, 8)
                      : "NA"}
                  </TableCell>{" "}
                  {/* Format submission time */}
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <Button className="mt-4" onClick={refresh}>
        Refresh Leaderboard
      </Button>
    </div>
  );
};

export default Leaderboard;
