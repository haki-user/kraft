"use client";
import { useState, useEffect } from "react";
import {
  Icons,
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
  // CreateSubmissionDTO,
  ExecutorResult,
  Problem,
  SubmissionResult,
  // TestRunResult,
  // Submission,
  Submissions,
} from "@kraft/types";
import type { TestCase } from "@kraft/types";
import { SubmissionSection } from "@/components/submissions-section";

import "./styles.css";

export default function ProblemPage({
  problemId,
}: {
  problemId: string;
}): JSX.Element {
  const [problem, setProblem] = useState<Problem>();
  // const [testCases, setTestCases] = useState<TestCase[]>([]);
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
        code,
        language: activeLanguage,
      });
      console.log({ res }, "submission...");
      await handleFetchSubmissoins();
      setActiveTab("submissions");
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
      // setActiveTab("submissions");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    void fetchProblem();
    void handleFetchSubmissoins();
    const locallySavedCode = localStorage.getItem(`${problemId}-code`);
    if (locallySavedCode) setCode(locallySavedCode);
  }, []);

  // Handle code change: Saving etc...
  useEffect(() => {
    localStorage.setItem(`${problemId}-code`, code);
    console.log("saved", code);
  }, [code]);

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
  // pending -- remove this later on.
  problemData,
}: {
  problemData: Problem;
}): JSX.Element {
  // Insert paragraph breaks before each example heading in the description.
  const formattedDescription = problemData.description.replace(
    /(<strong class="example">)/g,
    "</p><p>$1"
  );

  // Ensure the content is wrapped in a <p> to start if it doesn't already.
  const htmlToRender = formattedDescription.trim().startsWith("<p>")
    ? formattedDescription
    : `<p>${formattedDescription}</p>`;

  return (
    <div className="w-full h-full mt-1 pr-2 pb-4">
      <div className="w-full h-full flex flex-col space-y-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold dark:text-opacity-90 dark:text-white">
            {problemData.title}
          </h1>
          <div
            className="problem-description dark:text-opacity-[60%] dark:text-white"
            dangerouslySetInnerHTML={{ __html: htmlToRender }}
          />
        </div>
      </div>
    </div>
  );
}
