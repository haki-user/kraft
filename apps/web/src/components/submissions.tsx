"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@kraft/ui";
import type { Submission, Submissions } from "@kraft/types";
import { getAllUserContestSubmissions } from "@/services/submissions-service";
import { useEffect, useState } from "react";

export default function SubmissionSection({
  contestId,
}: {
  contestId: string;
}): JSX.Element {
  const [submissions, setSubmissions] = useState<Submissions>();
  const [isLoading, setIsLoading] = useState(true);
  const handleFetchSubmissoins = async () => {
    setIsLoading(true);
    try {
      const res = await getAllUserContestSubmissions(contestId);
      setSubmissions(res);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchSubmissoins();
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusBadgeClass = (status: Submission["status"]) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-500/20 text-green-500 dark:bg-green-500/10";
      case "WRONG_ANSWER":
        return "bg-red-500/20 text-red-500 dark:bg-red-500/10";
      case "RUNTIME_ERROR":
        return "bg-orange-500/20 text-orange-500 dark:bg-orange-500/10";
      case "TIME_LIMIT_EXCEEDED":
        return "bg-yellow-500/20 text-yellow-500 dark:bg-yellow-500/10";
      default:
        return "bg-gray-500/20 text-gray-500 dark:bg-gray-500/10";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="w-full space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-[150px]">Status</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Runtime</TableHead>
              <TableHead>Memory</TableHead>
              <TableHead className="text-right">Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              submissions &&
              submissions.submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-nowrap ${getStatusBadgeClass(
                        submission.status
                      )}`}
                    >
                      {formatStatus(submission.status)}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    {submission.language}
                  </TableCell>
                  <TableCell>
                    {submission.runtime > 0 ? `${submission.runtime} ms` : "-"}
                  </TableCell>
                  <TableCell>
                    {submission.memory > 0 ? `${submission.memory} MB` : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatDate(submission.timestamp)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-muted-foreground">
        Total Submissions: {submissions?.submissions.length} | Accepted:{" "}
        {submissions?.submissions.reduce(
          (acc, submission) => acc + (submission.status === "ACCEPTED" ? 1 : 0),
          0
        )}
      </div>
    </div>
  );
}
