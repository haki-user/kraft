"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  ScrollArea,
  ScrollBar,
  Badge,
} from "@kraft/ui";
import Editor from "@/components/editor";
import { ExecutionPanel } from "@/components/execution-panel";
import { fetchProblemById } from "@/services/problems-service";
import {
  createSubmission,
  executeTestRun,
  getSubmissionsForProblem,
} from "@/services/submissions-service";
import type {
  CreateSubmissionDTO,
  ExecutorResult,
  Problem,
  SubmissionResult,
  TestRunResult,
  Submission,
  Submissions,
} from "@kraft/types";
import type { TestCase } from "@kraft/types";

import "./styles.css";

// type TestCaseInput = Record<string, string>;

// interface TestCase {
//   readonly id: number;
//   input: TestCaseInput[];
//   output?: string;
// }

// interface Problem {
//   readonly id: number;
//   readonly name: string;
//   readonly description: string;
//   // readonly input: string;
//   // readonly output: string;
//   // readonly examples: string;
//   // readonly constraints: string;
// }

// interface Submission {
//   id: number;
//   problemId: number;
//   userId: string;
//   code: string;
//   language: string;
//   status: "ACCEPTED" | "WRONG_ANSWER" | "RUNTIME_ERROR" | "time_limit_exceeded";
//   runtime: number;
//   memory: number;
//   timestamp: number; // Unix timestamp for better performance
// }

// interface Submissions {
//   // readonly solved: boolean;
//   readonly submissions: readonly Submission[];
//   readonly totalCount: number;
//   readonly acceptedCount: number;
// }

const submissions1: Submissions = {
  submissions: [
    {
      id: "1",
      problemId: "1",
      userId: "user123",
      code: "function twoSum(nums: number[], target: number): number[] {...}",
      language: "typescript",
      status: "ACCEPTED",
      runtime: 76,
      memory: 42.3,
      timestamp: 1703116800000,
    },
    {
      id: "2",
      problemId: "1",
      userId: "user123",
      code: "function twoSum(nums: number[], target: number): number[] {...}",
      language: "typescript",
      status: "WRONG_ANSWER",
      runtime: 82,
      memory: 43.1,
      timestamp: 1703116700000,
    },
    {
      id: "3",
      problemId: "1",
      userId: "user123",
      code: "function twoSum(nums: number[], target: number): number[] {...}",
      language: "typescript",
      status: "RUNTIME_ERROR",
      runtime: 0,
      memory: 0,
      timestamp: 1703116600000,
    },
  ],
  totalCount: 3,
  acceptedCount: 1,
};

const problem1: Problem = {
  difficulty: "EASY",
  testCases: [],
  titleSlug: "two-sum",
  id: "1",
  title: "Two Sum",
  description: `<p>Given an array of integers <code>nums</code>&nbsp;and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>

<p>You may assume that each input would have <strong><em>exactly</em> one solution</strong>, and you may not use the <em>same</em> element twice.</p>

<p>You can return the answer in any order.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre>
<strong>Input:</strong> nums = [2,7,11,15], target = 9
<strong>Output:</strong> [0,1]
<strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].
</pre>

<p><strong class="example">Example 2:</strong></p>

<pre>
<strong>Input:</strong> nums = [3,2,4], target = 6
<strong>Output:</strong> [1,2]
</pre>

<p><strong class="example">Example 3:</strong></p>

<pre>
<strong>Input:</strong> nums = [3,3], target = 6
<strong>Output:</strong> [0,1]
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>2 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></code></li>
	<li><strong>Only one valid answer exists.</strong></li>
</ul>

<p>&nbsp;</p>
<strong>Follow-up:&nbsp;</strong>Can you come up with an algorithm that is less than <code>O(n<sup>2</sup>)</code><font face="monospace">&nbsp;</font>time complexity?`,
};

// const initialTestCases: TestCase[] = [
//   {
//     id: 1,
//     input: [{ nums: "1, 2, 3" }, { k: "2" }],
//   },
//   {
//     id: 2,
//     input: [{ nums: "3, 4, 5" }, { nums2: "5, 6, 7, 8" }],
//   },
// ];

export default function ProblemPage({
  params,
}: {
  params: { contestId: string; problemId: string };
}): JSX.Element {
  const { problemId, contestId } = params;
  const [problem, setProblem] = useState<Problem>();
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // const languages = ["C++", "JavaScript", "TypeScript", "Go", "Python"];
  const languages = ["Python"];
  const [activeLanguage, setActiveLanguage] = useState("Python");
  const [code, setCode] = useState<string>("");
  const [submissions, setSubmissions] = useState<Submissions>(submissions1);
  const [activeTab, setActiveTab] = useState("problem");

  const fetchProblem = async () => {
    setIsLoading(true);
    try {
      const res = await fetchProblemById(problemId);
      console.log({ res });
      setProblem({
        title: res.title,
        description: res.description,
        testCases: res.testCases,
        id: res.id,
        titleSlug: res.titleSlug,
        difficulty: res.difficulty,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestRun = async (
    testCases: TestCase[]
  ): Promise<ExecutorResult | null> => {
    try {
      const res = await executeTestRun({
        code,
        language: activeLanguage,
        problemId,
        testCases,
      });
      console.log({ res });

      return res;
    } catch (err) {
      console.error(err);
      return null;
    }
  };
  const handleSubmission = async () // data: Omit<CreateSubmissionDTO, "userId">
  : Promise<SubmissionResult | null> => {
    try {
      const res = await createSubmission({
        problemId,
        contestId,
        code,
        language: activeLanguage,
      });
      console.log({ res }, "submission...");
      await handleFetchSubmissoins();
      return res;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const handleFetchSubmissoins = async () => {
    try {
      const res = await getSubmissionsForProblem(problemId, contestId);
      // const cleaned = res.map((submission) => ({
      //   status: submission.status,
      //   runtime: submission.runtime,
      // }));
      setSubmissions(res);
      setActiveTab("submissions");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    void fetchProblem();
  }, []);

  if (!problem) return <div>Error problem not found.</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div>
        <div className="h-screen max-h-[calc(100vh-2.3rem)] debug-">
          <ResizablePanelGroup
            autoSaveId="contest-page-resizable-vertical"
            className="w-full h-full"
            direction="horizontal"
          >
            <ResizablePanel className="w-full h-full" defaultSize={50}>
              <div className="p-5 pr-0 pb-0 w-full h-full">
                <Tabs
                  className="w-full h-full"
                  defaultValue="problem"
                  value={activeTab}
                >
                  <div className="flex justify-between items-center w-full pr-5">
                    <TabsList>
                      <TabsTrigger
                        value="problem"
                        onClick={() => setActiveTab("problem")}
                      >
                        Problem
                      </TabsTrigger>
                      <TabsTrigger
                        value="submissions"
                        onClick={() => setActiveTab("submissions")}
                      >
                        Submissions
                      </TabsTrigger>
                    </TabsList>
                    {submissions.acceptedCount > 0 ? (
                      // <div className="text-primary-foreground bg-primary shadow-md shadow-secondary px-2.5 rounded-md text-sm">
                      <Badge
                        className="bg-primary dark:bg-primary dark:text-opacity-[87%]"
                        variant="default"
                      >
                        Solved
                      </Badge>
                    ) : (
                      // Solved
                      // </div>
                      submissions.totalCount > 0 && (
                        // <div className="text-primary-foreground bg-orange-500 dark:text-opacity-[87%] shadow-md shadow-secondary px-2.5 rounded-md">
                        <Badge
                          className="text-primary-foreground bg-orange-500 dark:text-opacity-[87%] shadow-md shadow-secondary"
                          variant="default"
                        >
                          Attempted
                        </Badge>
                        //  </div>
                      )
                    )}
                  </div>
                  <div className="w-full h-[calc(100%-3rem)] mt-2">
                    <ScrollArea className="w-full h-full pr-2">
                      <TabsContent value="problem">
                        <ProblemSection problemData={problem} />
                      </TabsContent>
                      <TabsContent value="submissions">
                        <SubmissionSection allSubmissions={submissions} />
                      </TabsContent>
                      <ScrollBar orientation="vertical" />
                    </ScrollArea>
                  </div>
                </Tabs>
              </div>
            </ResizablePanel>
            <ResizableHandle
              className="bg-secondary hover:bg-primary"
              withHandle
            />
            <ResizablePanel className="w-full h-full" defaultSize={50}>
              <ResizablePanelGroup
                autoSaveId="contest-page-resizable-horizontal"
                className="w-full h-full"
                direction="vertical"
              >
                <ResizablePanel defaultSize={55}>
                  <div className="w-full h-full">
                    <Editor
                      code={code}
                      setCode={setCode}
                      languages={languages}
                      activeLanguage={activeLanguage}
                      setActiveLanguage={setActiveLanguage}
                    />
                  </div>
                </ResizablePanel>
                <ResizableHandle
                  className="bg-secondary hover:bg-primary"
                  withHandle
                />
                <ResizablePanel defaultSize={45}>
                  <div className="w-full h-full p-4 pb-0">
                    <ExecutionPanel
                      initialTestCases={problem.testCases}
                      handleTestRun={handleTestRun}
                      handleSubmission={handleSubmission}
                    />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}

function ProblemSection({
  problemData,
}: {
  problemData: Problem;
}): JSX.Element {
  return (
    <div className="w-full h-full mt-1 pr-2 pb-4">
      <div className="w-full h-full flex flex-col space-y-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold dark:text-opacity-90 dark:text-white">
            {problemData.title}
          </h1>
          <div
            className="problem-description dark:text-opacity-[60%] dark:text-white"
            dangerouslySetInnerHTML={{ __html: problemData.description }}
          />
        </div>
      </div>
    </div>
  );
}

function SubmissionSection({
  allSubmissions,
}: {
  allSubmissions: Submissions;
}): JSX.Element {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusBadgeClass = (status: Submission["status"]) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-500/20 text-green-500 dark:bg-green-500/10";
      case "WRONG_ANSWER":
        return "bg-red-500/20 text-red-500 dark:bg-red-500/10";
      case "RUNTIME_ERROR":
        return "bg-orange-500/20 text-orange-500 dark:bg-orange-500/10";
      case "TIME_LIMIT_EXCEEDED":
        return "bg-yellow-500/20 text-yellow-500 dark:bg-yellow-500/10";
      default:
        return "bg-gray-500/20 text-gray-500 dark:bg-gray-500/10";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="w-full space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-[150px]">Status</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Runtime</TableHead>
              <TableHead>Memory</TableHead>
              <TableHead className="text-right">Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allSubmissions.submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-nowrap ${getStatusBadgeClass(
                      submission.status
                    )}`}
                  >
                    {formatStatus(submission.status)}
                  </span>
                </TableCell>
                <TableCell className="font-medium">
                  {submission.language}
                </TableCell>
                <TableCell>
                  {submission.runtime > 0 ? `${submission.runtime} ms` : "-"}
                </TableCell>
                <TableCell>
                  {submission.memory > 0 ? `${submission.memory} MB` : "-"}
                </TableCell>
                <TableCell className="text-right">
                  {formatDate(submission.timestamp)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-muted-foreground">
        Total Submissions: {allSubmissions.totalCount} | Accepted:{" "}
        {allSubmissions.acceptedCount}
      </div>
    </div>
  );
}
