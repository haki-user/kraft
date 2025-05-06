import api from "./axios-instance";
import type { Pagination, Problem } from "@kraft/types";

export const fetchProblemById = async (problemId: string): Promise<Problem> => {
  const response = await api.get(`/problems/${problemId}`);
  return response.data;
};

export const fetchPublicProblemById = async (
  problemId: string
): Promise<Problem> => {
  const response = await api.get(`/problems/public/${problemId}`);
  return response.data;
};

export const fetchPublicProblemByTitleSlug = async (
  titleSlug: string
): Promise<Problem> => {
  const res = await api.get(`problems/public/title/${titleSlug}`);
  return res.data;
};

/**
 * Fetch paginated public problems data.
 */
export const getPublicProblems = async (
  page: number,
  limit: number
): Promise<{ data: Problem[]; pagination: Pagination }> => {
  const response = await api.get("/problems", { params: { page, limit } });
  return response.data;
};
