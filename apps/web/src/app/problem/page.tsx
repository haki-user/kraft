"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
} from "@kraft/ui";
import { getPublicProblems } from "../../services/problems-service";
import type { Problem } from "@kraft/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProblemsPage: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProblems = async () => {
      setIsLoading(true);
      try {
        const data = await getPublicProblems(page, 10);
        setProblems(
          data.data.sort((a, b) => a.problemNumber - b.problemNumber)
        );
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error("Failed to fetch problems:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProblems();
  }, [page]);

  const getDifficultyStyles = (difficulty: string) => {
    const base =
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
    switch (difficulty.toUpperCase()) {
      case "EASY":
        return `${base} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
      case "MEDIUM":
        return `${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`;
      case "HARD":
        return `${base} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
      default:
        return `${base} bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400`;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 md:px-6 lg:px-8">
      {/* <div className="min-h-screen bg-gradient-to-br from-primary/10 via-blue-500/20  to-background dark:from-primary/10 dark:via-blue-500/5 py-0 pt-4"> */}
      {/* <div className="min-h-screen bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-transparent py-0 pt-4"> */}{" "}
      {/* use this one */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Problems</h1>

        <div className="rounded-lg border bgcard">
          <div className="relative overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/80">
                  <TableHead className="w-20 text-center font-semibold">
                    #
                  </TableHead>
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="w-32 text-center font-semibold">
                    Difficulty
                  </TableHead>
                  {/* <TableHead className="w-24 text-center font-semibold">
                    Acceptance
                  </TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-5 w-12 mx-auto" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-20 mx-auto" />
                        </TableCell>
                        {/* <TableCell>
                          <Skeleton className="h-5 w-16 mx-auto" />
                        </TableCell> */}
                      </TableRow>
                    ))
                  : problems.map((problem) => (
                      <TableRow
                        key={problem.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="text-center font-mono text-muted-foreground">
                          {problem.problemNumber}
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/problem/${problem.titleSlug}`}
                            className="font-medium hover:text-primary transition-colors inline-block w-full mx-auto"
                          >
                            {problem.title}
                          </Link>
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={getDifficultyStyles(problem.difficulty)}
                          >
                            {problem.difficulty}
                          </span>
                        </TableCell>
                        {/* <TableCell className="text-center text-sm text-muted-foreground">
                          {problem.acceptanceRate}%
                        </TableCell> */}
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between px-4 py-4 border-t">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground px-4 py-2 h-9"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground px-4 py-2 h-9"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemsPage;
