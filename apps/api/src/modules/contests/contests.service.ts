import { PrismaClient } from "@prisma/client";
import type { ContestUpdateDTO, CreateContestDTO, Contest } from "@kraft/types";

const prisma = new PrismaClient();

/**
 * Create a new contest
 * @param data - The contest data
 */
export const createContest = async (data: CreateContestDTO): Promise<void> => {
  await prisma.contest.create({
    data,
  });
};

/**
 * Get all contests
 * @returns List of all contests
 */
export const getAllContests = async (): Promise<Contest[]> => {
  return await prisma.contest.findMany();
};

/**
 * Get contests where a specific domain is allowed
 * @param domain - Domain to check
 * @returns List of contests allowing the domain
 */
export const getContestsByAllowedDomain = async (
  domain: string
): Promise<Contest[]> => {
  return await prisma.contest.findMany({
    where: {
      allowedDomains: {
        has: domain,
      },
    },
  });
};

/**
 * Get paginated contests
 * @param page - Current page number (1-indexed)
 * @param pageSize - Number of contests per page
 * @returns Paginated contests with metadata
 */
export const getPaginatedContests = async (
  page: number,
  pageSize: number
): Promise<{
  contests: Contest[];
  totalCount: number;
  totalPages: number;
}> => {
  const skip = (page - 1) * pageSize;
  const [contests, totalCount] = await Promise.all([
    prisma.contest.findMany({
      skip,
      take: pageSize,
    }),
    prisma.contest.count(),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return { contests, totalCount, totalPages };
};

/**
 * Get all upcoming contests
 * @returns List of all contests
 */
export const getAllUpcomingContests = async (): Promise<Contest[]> => {
  return await prisma.contest.findMany({
    where: {
      status: "SCHEDULED",
    },
  });
};

/**
 * Get contests starting within a specified range
 * @param startRange - Start of the range (Date)
 * @param endRange - End of the range (Date)
 * @returns Contests starting within the range
 */
export const getContestsByDateRange = async (
  startRange: Date,
  endRange: Date
): Promise<Contest[]> => {
  return await prisma.contest.findMany({
    where: {
      startTime: {
        gte: startRange,
        lte: endRange,
      },
    },
  });
};

/**
 * Get a single contest by ID
 * @param id - Contest ID
 * @returns Contest with details
 */
export const getContestById = async (id: string): Promise<Contest | null> => {
  return await prisma.contest.findUnique({
    where: { id },
  });
};

/**
 * Add a problem to a contest
 * @param contestId - Contest ID
 * @param problemId - Problem ID
 */
export const addProblemToContest = async (
  contestId: string,
  problemId: string
): Promise<void> => {
  await prisma.contestProblem.create({
    data: {
      contestId,
      problemId,
    },
  });
};

/**
 * Remove a problem from a contest
 * @param contestId - Contest ID
 * @param problemId - Problem ID
 */
export const removeProblemFromContest = async (
  contestId: string,
  problemId: string
): Promise<void> => {
  await prisma.contestProblem.deleteMany({
    where: {
      contestId,
      problemId,
    },
  });
};

/**
 * Register a user for a contest
 * @param contestId - Contest ID
 * @param userId - User ID
 */
export const registerUserForContest = async (
  contestId: string,
  userId: string
): Promise<void> => {
  await prisma.contestParticipation.create({
    data: {
      contestId,
      userId,
    },
  });
};

/**
 * Get contests created by a user
 * @param creatorId - User ID
 * @returns List of contests created by the user
 */
export const getContestsCreatedByUser = async (
  creatorId: string
): Promise<Contest[]> => {
  return prisma.contest.findMany({
    where: { creatorId },
  });
};

/**
 * Get contests a user is participating in
 * @param userId - User ID
 * @returns List of contests the user is participating in
 */
export const getContestsUserParticipating = async (
  userId: string
): Promise<Contest[]> => {
  return prisma.contest.findMany({
    where: {
      participants: {
        some: { userId },
      },
    },
  });
};

/**
 * Update a contest
 * @param id - Contest ID
 * @param data - Fields to update
 */
export const updateContest = async (
  id: string,
  data: ContestUpdateDTO
): Promise<void> => {
  await prisma.contest.update({
    where: { id },
    data,
  });
};

/**
 * Delete a contest
 * @param id - Contest ID
 */
export const deleteContest = async (id: string): Promise<void> => {
  await prisma.contest.delete({
    where: { id },
  });
};
