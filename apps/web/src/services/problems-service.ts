import api from "./axios-instance";
import type { Problem } from "@kraft/types";

export const fetchProblemById = async (problemId: string): Promise<Problem> => {
  const response = await api.get(`/problems/${problemId}`);
  return response.data;
};
