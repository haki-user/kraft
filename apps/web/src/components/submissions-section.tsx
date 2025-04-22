import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  ScrollArea,
  ScrollBar,
} from "@kraft/ui";
import type { Submissions } from "@kraft/types";
import {
  formatDate,
  formatLanguageName,
  formatStatus,
  getStatusBadgeClass,
} from "@/utils";

export function SubmissionSection({
  allSubmissions,
}: {
  allSubmissions: Submissions;
}): JSX.Element {
  return (
    <div className="w-full space-y-4">
      <div className="text-xs text-muted-foreground">
        Total Submissions: {allSubmissions.totalCount} | Accepted:{" "}
        {allSubmissions.acceptedCount}
      </div>
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
            {[
              ...allSubmissions.submissions.sort(
                (a, b) =>
                  new Date(b.timestamp).getTime() -
                  new Date(a.timestamp).getTime()
              ),
            ].map((submission) => (
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
                  <Button
                    variant="link"
                    className="px-2 hover:text-primary/75 active:text-primary/55"
                    onClick={() =>
                      navigator.clipboard.writeText(submission?.code || "")
                    }
                    title="Copy code"
                  >
                    {formatLanguageName(submission.language)}
                  </Button>
                </TableCell>
                <TableCell>
                  {submission.runtime > 0
                    ? `${Math.round(submission.runtime)} ms`
                    : "-"}
                </TableCell>
                <TableCell>
                  {submission.memoryUsed > 0
                    ? `${Math.round(submission.memoryUsed * 10) / 10} MB`
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  {formatDate(submission.timestamp)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
