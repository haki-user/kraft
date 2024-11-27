export type ContestStatus = "DRAFT" | "SCHEDULED" | "ONGOING" | "COMPLETED";

export interface ContestState {
  contests: Contest[];
  loading: boolean;
  error: string | null;

  // Actions
  addProblemToContest: (data: AddProblemToContestDTO) => Promise<void>;
  removeProblemFromContest: (
    data: RemoveProblemFromContestDTO
  ) => Promise<void>;
}

export interface Contest {
  id: string;
  title: string;
  titleSlug: string;
  description: string;
  startTime: Date;
  endTime: Date;
  status: ContestStatus;
  creatorId: string;
  participantsCount: number;
  problemsCount: number;
  isRegistered: boolean;
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
  Omit<Contest, "id" | "problems" | "creatorId" | "participants"> & {
    allowedDomains?: string[];
    maxParticipants?: number;
  }
>; // Updatable fields except `id`, `problems`, and `creatorId`

/**
 * Interface for adding problems to a contest
 */
export interface AddProblemToContestDTO {
  contestId: string;
  problemIds: string; // IDs of problems to associate with the contest
}

/**
 * Interface for removing problems from a contest
 */
export interface RemoveProblemFromContestDTO {
  contestId: string;
  problemIds: string; // IDs of problems to disassociate from the contest
}
