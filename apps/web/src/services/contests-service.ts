import api from "./axios-instance";
import type {
  Contest,
  CreateContestDTO,
  ContestUpdateDTO,
  AddProblemToContestDTO,
  RemoveProblemFromContestDTO,
  ContestProblem,
} from "@kraft/types";

export const fetchAllContests = async (): Promise<Contest[]> => {
  console.log("fetching contests...");
  const response = await api.get("/contests");
  return response.data;
};

export const fetchContestProblemDetails = async (
  contestId: string
): Promise<ContestProblem[]> => {
  const response = await api.get(`/contests/${contestId}/problems`);
  return response.data;
};

export const fetchContestsByDomain = async (
  domain: string
): Promise<Contest[]> => {
  const response = await api.get(`/contests/domain`, { params: { domain } });
  return response.data;
};

export const fetchPaginatedContests = async (
  page: number,
  pageSize: number
): Promise<{ contests: Contest[]; total: number }> => {
  const response = await api.get("/contests/paginated", {
    params: { page, pageSize },
  });
  return response.data;
};

export const fetchContestsByDateRange = async (
  startDate: Date,
  endDate: Date
): Promise<Contest[]> => {
  const response = await api.get("/contests/date-range", {
    params: { startDate, endDate },
  });
  return response.data;
};

export const fetchUpcomingContests = async (): Promise<Contest[]> => {
  const response = await api.get("/contests/upcoming");
  return response.data;
};

export const fetchContestById = async (id: string): Promise<Contest> => {
  const response = await api.get(`/contests/${id}`);
  return response.data;
};

export const createContest = async (
  contestData: CreateContestDTO
): Promise<Contest> => {
  const response = await api.post("/contests", contestData);
  return response.data;
};

export const updateContest = async (
  id: string,
  contestData: ContestUpdateDTO
): Promise<Contest> => {
  const response = await api.put(`/contests/${id}`, contestData);
  return response.data;
};

export const deleteContest = async (id: string): Promise<void> => {
  await api.delete(`/contests/${id}`);
};

export const addProblemToContest = async (
  data: AddProblemToContestDTO
): Promise<void> => {
  await api.post("/contests/add-problem", data);
};

export const removeProblemFromContest = async (
  data: RemoveProblemFromContestDTO
): Promise<void> => {
  await api.post("/contests/remove-problem", data);
};

export const registerForContest = async (contestId: string): Promise<void> => {
  await api.post("/contests/register", { contestId });
};
