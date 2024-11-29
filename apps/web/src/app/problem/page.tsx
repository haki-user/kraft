"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@kraft/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@kraft/ui";
import { Skeleton } from "@kraft/ui";
import { getPublicProblems } from "../../services/problems-service";

export interface Problem {
  id: string;
  title: string;
  titleSlug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

const ProblemsPage: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchProblems = async (page: number) => {
    setIsLoading(true);
    try {
      const data = await getPublicProblems(page, 10);
      console.log(data);
      setProblems(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch problems:", error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log({ problems });
  useEffect(() => {
    fetchProblems(page);
  }, [page]);

  const getDifficultyBadge = (difficulty: "EASY" | "MEDIUM" | "HARD") => {
    const color =
      difficulty === "EASY"
        ? "bg-green-100 text-green-800"
        : difficulty === "MEDIUM"
          ? "bg-yellow-100 text-yellow-800"
          : "bg-red-100 text-red-800";

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${color}`}>
        {difficulty}
      </span>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Problems</h1>

      {isLoading ? (
        <Skeleton className="h-10 w-full mb-4" />
      ) : problems.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Difficulty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {problems.map((problem) => (
                <TableRow key={problem.id}>
                  <TableCell>
                    <Link
                      href={`/problem/${problem.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {problem.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {getDifficultyBadge(problem.difficulty)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <span className="text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <p>No problems available.</p>
      )}
    </div>
  );
};

export default ProblemsPage;
