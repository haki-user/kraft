import { Request, Response } from "express";
import {
  createContest,
  getAllContests,
  // getContestsByAllowedDomain,
  // getPaginatedContests,
  // getAllUpcomingContests,
  // getContestsByDateRange,
  getContestById,
  getContestProblemDetails,
  addProblemToContest,
  removeProblemFromContest,
  registerUserForContest,
  // getContestsCreatedByUser,
  // getContestsUserParticipating,
  updateContest,
  deleteContest,
  getAllContestsForUser,
} from "./contests.service"; // Import service functions
import { Contest } from "@kraft/types";

/**
 * Create a new contest
 */
export const createContestHandler = async (req: Request, res: Response) => {
  try {
    await createContest(req.body);
    res.status(201).json({ message: "Contest created successfully." });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
};

/**
 * Get all contests
 */
export const getAllContestsHandler = async (req: Request, res: Response) => {
  try {
    const contests = await getAllContests();
    res.status(200).json(contests);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
};

/**
 * Get contests by allowed domain
 */
// export const getContestsByDomainHandler = async (
//   req: Request,
//   res: Response
// ) => {
//   const { domain } = req.query as { domain: string };
//   try {
//     const contests = await getContestsByAllowedDomain(domain);
//     res.status(200).json(contests);
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(500).json({ message: error.message });
//     } else {
//       res.status(500).json({ message: "An unknown error occurred." });
//     }
//   }
// };

/**
 * Get paginated contests
 */
// export const getPaginatedContestsHandler = async (
//   req: Request,
//   res: Response
// ) => {
//   const { page = 1, pageSize = 10 } = req.query;
//   try {
//     const { contests, totalCount, totalPages } = await getPaginatedContests(
//       parseInt(page as string),
//       parseInt(pageSize as string)
//     );
//     res.status(200).json({ contests, totalCount, totalPages });
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(500).json({ message: error.message });
//     } else {
//       res.status(500).json({ message: "An unknown error occurred." });
//     }
//   }
// };

/**
 * Get all upcoming contests
 */
// export const getUpcomingContestsHandler = async (
//   _req: Request,
//   res: Response
// ) => {
//   try {
//     const contests = await getAllUpcomingContests();
//     res.status(200).json(contests);
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(500).json({ message: error.message });
//     } else {
//       res.status(500).json({ message: "An unknown error occurred." });
//     }
//   }
// };

/**
 * Get contests by date range
 */
// export const getContestsByDateRangeHandler = async (
//   req: Request,
//   res: Response
// ) => {
//   const { start, end } = req.query as { start: string; end: string };
//   try {
//     const contests = await getContestsByDateRange(
//       new Date(start),
//       new Date(end)
//     );
//     res.status(200).json(contests);
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(500).json({ message: error.message });
//     } else {
//       res.status(500).json({ message: "An unknown error occurred." });
//     }
//   }
// };

/**
 * Get a contest by ID
 */
export const getContestByIdHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const contest = await getContestById(id);
    if (!contest) {
      res.status(404).json({ message: "Contest not found." });
      return;
    }
    res.status(200).json(contest);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
};

/**
 * Get problems by contest Id
 */
export const getContestProblemDetailsHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const user = req.user;
  try {
    const problems = await getContestProblemDetails(id, user?.id);
    res.status(200).json(problems);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
};

/**
 * Add a problem to a contest
 */
export const addProblemToContestHandler = async (
  req: Request,
  res: Response
) => {
  const { contestId, problemId, points } = req.body;
  try {
    await addProblemToContest(contestId, problemId, points);
    res.status(200).json({ message: "Problem added to contest successfully." });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
};

/**
 * Remove a problem from a contest
 */
export const removeProblemFromContestHandler = async (
  req: Request,
  res: Response
) => {
  const { contestId, problemId } = req.body;
  try {
    await removeProblemFromContest(contestId, problemId);
    res
      .status(200)
      .json({ message: "Problem removed from contest successfully." });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
};

/**
 * Register a user for a contest
 */
export const registerUserForContestHandler = async (
  req: Request,
  res: Response
) => {
  const { contestId } = req.body;
  const user = req.user;
  if (!user) {
    res.sendStatus(400);
    return;
  }
  try {
    await registerUserForContest(contestId, user.id);
    res
      .status(200)
      .json({ message: "User registered for contest successfully." });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
};

/**
 * Get contests created by a user
 */
// export const getContestsCreatedByUserHandler = async (
//   req: Request,
//   res: Response
// ) => {
//   const { creatorId } = req.params;
//   try {
//     const contests = await getContestsCreatedByUser(creatorId);
//     res.status(200).json(contests);
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(500).json({ message: error.message });
//     } else {
//       res.status(500).json({ message: "An unknown error occurred." });
//     }
//   }
// };

/**
 * Get contests a user is participating in
 */
// export const getContestsUserParticipatingHandler = async (
//   req: Request,
//   res: Response
// ) => {
//   const { userId } = req.params;
//   try {
//     const contests = await getContestsUserParticipating(userId);
//     res.status(200).json(contests);
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(500).json({ message: error.message });
//     } else {
//       res.status(500).json({ message: "An unknown error occurred." });
//     }
//   }
// };

/**
 * Update a contest
 */
export const updateContestHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await updateContest(id, req.body);
    res.status(200).json({ message: "Contest updated successfully." });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
};

/**
 * Delete a contest
 */
export const deleteContestHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteContest(id);
    res.status(200).json({ message: "Contest deleted successfully." });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
};

/**
 * Get all contests for user
 */
export const getAllContestsForUserHandler = async (
  req: Request,
  res: Response
) => {
  const user = req.user;
  console.log({ user });
  try {
    const contests = await getAllContestsForUser(user?.id);
    res.json(contests);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
};
