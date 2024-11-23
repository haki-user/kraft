import { Request, Response } from "express";
import * as ProblemsService from "./problems.service";

export const getAllProblemsDataPaginated = async (
  req: Request,
  res: Response
) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const { problemsData, total } =
      await ProblemsService.getAllProblemsDataPaginated(
        Number(page),
        Number(limit)
      );
    res.json({
      data: problemsData,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch problems." });
  }
};

export const getProblemDataById = async (req: Request, res: Response) => {
  const { problemId } = req.params;
  try {
    const problemData = await ProblemsService.getProblemDataById(problemId);
    if (!problemData) {
      res.status(404).json({ error: "Problem not found." });
      return;
    }
    res.json(problemData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch problem data." });
  }
};

export const getProblemById = async (req: Request, res: Response) => {
  const { problemId } = req.params;
  try {
    const problem = await ProblemsService.getProblemById(problemId);
    if (!problem) {
      res.status(404).json({ error: "Problem not found." });
      return;
    }
    res.json(problem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch the problem." });
  }
};

export const createProblem = async (req: Request, res: Response) => {
  try {
    const problem = await ProblemsService.createProblem(req.body);
    res.status(201).json(problem);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create problem." });
  }
};

export const updateProblem = async (req: Request, res: Response) => {
  console.log({ pp: req.params.problemId });
  try {
    const problem = await ProblemsService.updateProblemById(
      req.params.problemId,
      req.body
    );
    if (!problem) {
      res.status(500).json({ error: "Failed to update problem." }); // is this the right status code?
      return;
    }
    res.json(problem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update problem." });
  }
};

export const deleteProblem = async (req: Request, res: Response) => {
  try {
    const problem = await ProblemsService.deleteProblemById(
      req.params.problemId
    );
    if (!problem) {
      res.status(404).json({ error: "Problem not found." });
      return;
    }
    const testCases = await ProblemsService.deleteAllTestCasesByProblemId(
      req.params.problemId
    );
    if (!testCases) {
      res
        .status(500)
        .json({ error: "Problem deleted but failed to delete test cases." }); // fix it later
      return;
    }
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete the problem." });
  }
};

export const getAllTestCases = async (req: Request, res: Response) => {
  const { problemId } = req.params;
  try {
    const testCases =
      await ProblemsService.getAllTestCasesByProblemId(problemId);
    if (!testCases) {
      res.status(404).json({ error: "test cases not found." });
      return;
    }
    res.json(testCases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch test cases." });
  }
};

export const getAllPublicTestCases = async (req: Request, res: Response) => {
  const { problemId } = req.params;
  try {
    const testCases =
      await ProblemsService.getAllPublicTestCasesByProblemId(problemId);
    if (!testCases) {
      res.status(404).json({ error: "Public test cases not found." });
      return;
    }
    res.json(testCases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Public test cases." });
  }
};

export const createTestCases = async (req: Request, res: Response) => {
  try {
    const testCases = await ProblemsService.createTestCases({
      problemId: req.params.problemId,
      testCases: req.body,
    });
    res.status(201).json(testCases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create test cases." });
  }
};

export const updateTestCase = async (req: Request, res: Response) => {
  try {
    const testCase = await ProblemsService.updateTestCaseById(
      req.params.testCaseId,
      req.body
    );
    if (!testCase) {
      res.status(500).json({ error: "Failed to update the test case." }); // is this the right status code?
      return;
    }
    res.json(testCase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update test case." });
  }
};

export const deleteAllTestCases = async (req: Request, res: Response) => {
  try {
    const testCase = await ProblemsService.deleteAllTestCasesByProblemId(
      req.params.problemId
    );
    if (!testCase) {
      res.status(404).json({ error: "Test cases not found." }); // is this correct?
      return;
    }
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete the test cases." });
  }
};

export const deleteTestCase = async (req: Request, res: Response) => {
  try {
    const testCase = await ProblemsService.deleteTestCaseById(
      req.params.testCaseId
    );
    if (!testCase) {
      res.status(404).json({ error: "Test case not found." }); // is this correct
      return;
    }
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete the test case." });
  }
};
