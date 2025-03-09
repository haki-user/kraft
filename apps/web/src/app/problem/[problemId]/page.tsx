"use client";
import { useState, useEffect } from "react";
import {
  Icons,
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

export default function ProblemPage({
  params,
}: {
  params: { problemId: string };
}): JSX.Element {
  const { problemId } = params;
  const [problem, setProblem] = useState<Problem>();
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // const languages = ["C++", "JavaScript", "TypeScript", "Go", "Python"];
  const languages = ["Python"];
  const [activeLanguage, setActiveLanguage] = useState("Python");
  const [code, setCode] = useState<string>("");
  const [submissions, setSubmissions] = useState<Submissions>({
    submissions: [],
    totalCount: 0,
    acceptedCount: 0,
  });
  const [activeTab, setActiveTab] = useState("problem");

  useEffect(() => {
    if (activeTab === "submissions") {
      (async () => {
        const res = await getSubmissionsForProblem(problemId);
        setSubmissions(res);
      })();
    }
  }, [activeTab]);

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
        // contestId,
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
      const res = await getSubmissionsForProblem(problemId);
      setSubmissions(res);
      setActiveTab("submissions");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    void fetchProblem();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-[calc(100vh-2.2rem)] flex items-center justify-center">
        <Icons.spinner className="animate-spin"></Icons.spinner>
      </div>
    );
  }
  if (!problem) return <div>Error problem not found.</div>;

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
