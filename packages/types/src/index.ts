export * from "./auth";
export * from "./problems";
export * from "./contests";
export * from "./submissions";
export * from "./code-runner";
export * from "./leaderboard";

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
