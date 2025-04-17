"use client";
import { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ScrollArea,
  ScrollBar,
  // Icons,
  Skeleton,
} from "@kraft/ui";
import type { Submission, Submissions } from "@kraft/types";
import { getAllUserContestSubmissions } from "@/services/submissions-service";
import { Code } from "lucide-react";

export default function SubmissionSection({
  contestId,
}: {
  contestId: string;
}): JSX.Element {
  const [submissions, setSubmissions] = useState<Submissions>();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
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
    return new Date(timestamp).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
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
      {/* modal to show any submission code */}
      <SubmissionModal
        selectedSubmission={selectedSubmission}
        setSelectedSubmission={setSelectedSubmission}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead className="max-w-[150px]">Status</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Runtime</TableHead>
              <TableHead>Memory</TableHead>
              <TableHead
              // className="text-right"
              >
                Submitted
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell>
                  <Skeleton className="w-1/2 h-4 my-2.5" />
                </TableCell>
                <TableCell className="text-center">
                  {/* <div className="flex justify-center items-center space-x-2"> */}
                  <Skeleton className="w-10/12 h-4 my-2.5" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-1/2 h-4 my-2.5" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-1/2 h-4 my-2.5" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-1/2 h-4 my-2.5" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-11/12 my-2.5 h-4" />
                </TableCell>
                {/* </div> */}
              </TableRow>
            ) : submissions?.submissions ? (
              [
                ...submissions?.submissions.sort(
                  (a, b) =>
                    new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime()
                ),
              ].map((submission, idx) => (
                <TableRow key={submission.id}>
                  <TableCell>{submissions.submissions.length - idx}</TableCell>
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
                    <Button
                      variant="link"
                      className="px-2"
                      onClick={() => setSelectedSubmission(submission)}
                      title="View Submission"
                    >
                      {submission.language}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {submission.runtime > 0
                      ? `${Math.round(submission.runtime)} ms`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {submission.memory > 0
                      ? `${Math.round(submission.memory * 10) / 10} MB`
                      : "-"}
                  </TableCell>
                  <TableCell
                  // className="text-right"
                  >
                    {formatDate(submission.timestamp)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No submissions yet.
                </TableCell>
              </TableRow>
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

function SubmissionModal({
  selectedSubmission,
  setSelectedSubmission,
}: {
  selectedSubmission: Submission | null;
  setSelectedSubmission: (submission: Submission | null) => void;
}): JSX.Element {
  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto ${selectedSubmission ? "" : "hidden"}`}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-background pt-5 pb-4 sm:pb-4 px-2">
            <div className="mt-3 sm:mt-0  sm:text-left">
              <h3
                className="leading-6 font-bold text-gray-900 dark:text-primary-foreground"
                id="modal-headline"
              >
                Submission Code
              </h3>
              {/* code snippet */}
              <ScrollArea className="border-[1px] border-solid border-gray-5 border-secondary rounded-lg  h-[70vh] w-[80vw] min-w-96 p-2 bg-slate-5 bg-secondary mt-3 text-nowrap">
                <Button
                  variant="link"
                  className="absolute top-2 right-2 no-underline hover:no-underline hover:text-primary/75 active:text-primary/55"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      selectedSubmission?.code || ""
                    )
                  }
                >
                  <Code className="w-5 h-5" />
                  Copy
                </Button>
                <pre className="text-sm p-2 ">{selectedSubmission?.code}</pre>

                <ScrollBar id="submission-code-scb-v" orientation="vertical" />
                <ScrollBar
                  id="submission-code-scb-h"
                  orientation="horizontal"
                />
              </ScrollArea>
            </div>
          </div>
          <div className="bg-background px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button
              onClick={() => setSelectedSubmission(null)}
              className="active:bg-primary/45"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
