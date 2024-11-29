import api from "./axios-instance";
import type { Problem } from "@kraft/types";

export const fetchProblemById = async (problemId: string): Promise<Problem> => {
  const response = await api.get(`/problems/${problemId}`);
  return response.data;
};

/**
 * Fetch paginated public problems data.
 */
export const getPublicProblems = async (page: number, limit: number) => {
  const response = await api.get("/problems", { params: { page, limit } });
  return response.data;
};
