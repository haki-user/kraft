import { PrismaClient } from "@prisma/client";
import type {
  ContestUpdateDTO,
  CreateContestDTO,
  Contest,
  Problem,
  ContestProblem,
} from "@kraft/types";

const prisma = new PrismaClient();

/**
 * Create a new contest
 * @param data - The contest data
 */
export const createContest = async (data: CreateContestDTO): Promise<void> => {
  await prisma.contest.create({
    data,
    include: {
      _count: {
        select: {
          participants: true,
          contestProblems: true,
        },
      },
    },
  });
};

/**
 * Get all contests
 * @returns List of all contests
 */
export const getAllContests = async (): Promise<
  Omit<Contest, "isRegistered" | "participantsCount" | "problemsCount">[]
> => {
  return await prisma.contest.findMany();
};

/**
 * Get contests where a specific domain is allowed
 * @param domain - Domain to check
 * @returns List of contests allowing the domain
 */
// export const getContestsByAllowedDomain = async (
//   domain: string
// ): Promise<Contest[]> => {
//   return await prisma.contest.findMany({
//     where: {
//       allowedDomains: {
//         has: domain,
//       },
//     },
//   });
// };

/**
 * Get paginated contests
 * @param page - Current page number (1-indexed)
 * @param pageSize - Number of contests per page
 * @returns Paginated contests with metadata
 */
// export const getPaginatedContests = async (
//   page: number,
//   pageSize: number
// ): Promise<{
//   contests: Contest[];
//   totalCount: number;
//   totalPages: number;
// }> => {
//   const skip = (page - 1) * pageSize;
//   const [contests, totalCount] = await Promise.all([
//     prisma.contest.findMany({
//       skip,
//       take: pageSize,
//     }),
//     prisma.contest.count(),
//   ]);

//   const totalPages = Math.ceil(totalCount / pageSize);

//   return { contests, totalCount, totalPages };
// };

/**
 * Get all upcoming contests
 * @returns List of all contests
 */
// export const getAllUpcomingContests = async (): Promise<Contest[]> => {
//   return await prisma.contest.findMany({
//     where: {
//       status: "SCHEDULED",
//     },
//   });
// };

/**
 * Get contests starting within a specified range
 * @param startRange - Start of the range (Date)
 * @param endRange - End of the range (Date)
 * @returns Contests starting within the range
 */
// export const getContestsByDateRange = async (
//   startRange: Date,
//   endRange: Date
// ): Promise<Contest[]> => {
//   return await prisma.contest.findMany({
//     where: {
//       startTime: {
//         gte: startRange,
//         lte: endRange,
//       },
//     },
//   });
// };

/**
 * Get contest problems by contest ID
 * @param contestId - Contest ID
 * @returns List of problems in the contest
 */
// export const getContestProblems = async (
//   contestId: string
// ): Promise<ContestProblem[]> => {
//   const res = await prisma.contestProblem.findMany({
//     where: {
//       contestId,
//     },
//     select: {
//       id: true,
//       contestId: true,
//       problemId: true,
//       problem: {
//         select: {
//           id: true,
//           title: true,
//           titleSlug: true,
//           difficulty: true,
//         },
//       },
//     },
//   });
//   return res.map((contestProblem) => ({
//     id: contestProblem.problem.id,
//     title: contestProblem.problem.title,
//     titleSlug: contestProblem.problem.titleSlug,
//     difficulty: contestProblem.problem.difficulty,
//     isSolved: false, // Add default value or compute based on your requirements
//   }));
// };

/**
 * Get a single contest by ID
 * @param id - Contest ID
 * @returns Contest with details
 */
// export const getContestById = async (id: string): Promise<Contest | null> => {
//   return await prisma.contest.findUnique({
//     where: { id },
//   });
// };

/**
 * Add a problem to a contest
 * @param contestId - Contest ID
 * @param problemId - Problem ID
 */
export const addProblemToContest = async (
  contestId: string,
  problemId: string,
  points: number
): Promise<void> => {
  await prisma.contestProblem.create({
    data: {
      contestId,
      problemId,
      points,
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
// export const registerUserForContest = async (
//   contestId: string,
//   userId: string
// ): Promise<void> => {
//   await prisma.contestParticipation.create({
//     data: {
//       contestId,
//       userId,
//     },
//   });
// };

// /**
//  * Get contests created by a user
//  * @param creatorId - User ID
//  * @returns List of contests created by the user
//  */
// export const getContestsCreatedByUser = async (
//   creatorId: string
// ): Promise<Contest[]> => {
//   return prisma.contest.findMany({
//     where: { creatorId },
//   });
// };

/**
 * Get contests a user is participating in
 * @param userId - User ID
 * @returns List of contests the user is participating in
 */
// export const getContestsUserParticipating = async (
//   userId: string
// ): Promise<Contest[]> => {
//   return prisma.contest.findMany({
//     where: {
//       participants: {
//         some: { userId },
//       },
//     },
//   });
// };

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

// import { PrismaClient } from "@prisma/client";
// import {
//   Contest,
//   ContestProblem,
//   CreateContestDTO,
//   ContestStatus
// } from "@kraft/types";

// const prisma = new PrismaClient();

// export const createContest = async (
//   data: CreateContestDTO
// ): Promise<Contest> => {
//   return await prisma.contest.create({
//     data,
//     include: {
//       _count: {
//         select: {
//           participants: true,
//           contestProblems: true,
//         },
//       },
//     },
//   });
// };

export const getAllContestsForUser = async (
  userId?: string
): Promise<Contest[]> => {
  const userOrgDomain = userId
    ? await prisma.user.findUnique({
        select: {
          organizationDomain: true,
        },
        where: {
          id: userId,
        },
      })
    : null;
  const contests = await prisma.contest.findMany({
    where: {
      AND: [
        {
          OR: [
            { allowedDomains: { has: "all" } },
            ...(userOrgDomain?.organizationDomain
              ? [{ allowedDomains: { has: userOrgDomain.organizationDomain } }]
              : []),
          ],
        },
        {
          status: {
            not: "DRAFT",
          },
        },
      ],
    },
    include: {
      _count: {
        select: {
          participants: true,
          contestProblems: true,
        },
      },
    },
    orderBy: { startTime: "desc" },
  });
  const userParticipations = await prisma.contestParticipation.findMany({
    where: { userId },
    select: { contestId: true },
  });

  const finalContests = contests.map((contest) => ({
    id: contest.id,
    titleSlug: contest.titleSlug,
    title: contest.title,
    description: contest.description,
    creatorId: contest.creatorId,
    startTime: contest.startTime,
    endTime: contest.endTime,
    status: contest.status,
    maxParticipants: contest.maxParticipants,
    participantsCount: contest._count.participants,
    problemsCount: contest._count.contestProblems,
    isRegistered: userParticipations.some(
      (participation) => participation.contestId === contest.id
    ),
  }));
  return finalContests;
};

export const getContestProblemDetails = async (
  contestId: string,
  userId?: string
): Promise<ContestProblem[]> => {
  const contest = await prisma.contest.findUnique({
    where: {
      id: contestId,
    },
  });
  if (
    !contest ||
    contest.status === "DRAFT" ||
    contest.status === "SCHEDULED" ||
    new Date(contest.startTime) > new Date()
  ) {
    throw new Error("Contest is not accessible or available at this time.");
  }
  const contestProblems = await prisma.contestProblem.findMany({
    where: { contestId },
    include: { problem: true },
  });

  const solvedProblems = userId
    ? await prisma.submission.findMany({
        where: {
          userId,
          problemId: { in: contestProblems.map((cp) => cp.problemId) },
          status: "ACCEPTED",
        },
        select: { problemId: true },
      })
    : [];

  return contestProblems.map((cp) => ({
    id: cp.problem.id,
    title: cp.problem.title,
    titleSlug: cp.problem.titleSlug,
    difficulty: cp.problem.difficulty,
    points: cp.points,
    isSolved: solvedProblems.some((sp) => sp.problemId === cp.problem.id),
  }));
};

export const registerUserForContest = async (
  contestId: string,
  userId: string
): Promise<void> => {
  const contest = await prisma.contest.findUnique({
    where: { id: contestId },
    select: {
      maxParticipants: true,
      _count: { select: { participants: true } },
    },
  });

  if (!contest) {
    throw new Error("Contest not found.");
  }

  if (
    contest.maxParticipants &&
    contest._count.participants >= contest.maxParticipants
  ) {
    throw new Error("Contest has reached maximum participants");
  }

  await prisma.contestParticipation.create({
    data: { contestId, userId },
  });
};

export const getContestById = async (
  id: string
): Promise<Omit<Contest, "isRegistered"> | null> => {
  const contest = await prisma.contest.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          participants: true,
          contestProblems: true,
        },
      },
    },
  });

  return contest
    ? {
        ...contest,
        participantsCount: contest._count.participants,
        problemsCount: contest._count.contestProblems,
      }
    : null;
};
