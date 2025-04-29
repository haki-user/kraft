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
  ScrollArea,
} from "@kraft/ui";
import { fetchLeaderboard } from "@/services/leaderboard-service";
import type { Contest, LeaderboardParticipant } from "@kraft/types";
import { RefreshCwIcon } from "lucide-react";

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
      <h1 className="text-2xl font-semibold mb-4">
        Contest Leaderboard
        <Button className="mt-4" variant={null} onClick={refresh}>
          <RefreshCwIcon className={`${isLoading ? "animate-spin" : ""} `} />
        </Button>
      </h1>
      <ScrollArea className="h-[75vh]">
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
                      {
                        // time taken in hh:mm:ss format
                        new Date(
                          new Date(participant.finishTime).getTime() -
                            new Date(contestDetails.startTime).getTime()
                        )
                          .toISOString()
                          .substring(11, 19)
                      }
                    </TableCell>{" "}
                    {/* Format submission time */}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default Leaderboard;
