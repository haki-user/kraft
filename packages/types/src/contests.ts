export type ContestStatus = "DRAFT" | "SCHEDULED" | "ONGOING" | "COMPLETED";

export interface Contest {
  id: string;
  title: string;
  titleSlug: string;
  description: string;
  startTime: Date;
  endTime: Date;
  status: ContestStatus;
  creatorId: string;
}

/**
 * DTO for creating a contest
 */
export interface CreateContestDTO {
  title: string;
  titleSlug: string;
  description: string;
  startTime: Date;
  endTime: Date;
  status?: ContestStatus; // Optional, defaults to "DRAFT"
  problemIds?: string[]; // IDs of problems to include in the contest
  creatorId: string;
  allowedDomains?: string[];
  maxParticipants?: number;
}

/**
 * DTO for updating a contest
 */
export type ContestUpdateDTO = Partial<
  Omit<Contest, "id" | "problems" | "creatorId"> & {
    allowedDomains?: string[];
    maxParticipants?: number;
  }
>; // Updatable fields except `id`, `problems`, and `creatorId`

/**
 * Interface for adding problems to a contest
 */
export interface AddProblemsToContestDTO {
  contestId: string;
  problemIds: string[]; // IDs of problems to associate with the contest
}

/**
 * Interface for removing problems from a contest
 */
export interface RemoveProblemsFromContestDTO {
  contestId: string;
  problemIds: string[]; // IDs of problems to disassociate from the contest
}
