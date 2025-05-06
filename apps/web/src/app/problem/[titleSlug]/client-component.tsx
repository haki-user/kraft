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
import { fetchPublicProblemByTitleSlug } from "@/services/problems-service";
import {
  createSubmission,
  executeTestRun,
  getSubmissionsForProblemByTitleSlug,
} from "@/services/submissions-service";
import type {
  ExecutorResult,
  Problem,
  Submissions,
  TestCase,
} from "@kraft/types";
import { SubmissionSection } from "@/components/submissions-section";
import { config } from "@/utils";
import { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import "./styles.css";

let renderCount = 0;

export default function ProblemPage({
  titleSlug,
}: {
  titleSlug: string;
}): JSX.Element {
  const [problem, setProblem] = useState<Problem>();
  const [isLoading, setIsLoading] = useState(true);
  const languages = config.SUPPORTED_LANGUAGES;
  const [activeLanguage, setActiveLanguage] = useState(
    config.DEFAULT_ACTIVE_LANGUAGE
  );
  const [code, setCode] = useState<string>("");
  const [submissions, setSubmissions] = useState<Submissions>({
    submissions: [],
    totalCount: 0,
    acceptedCount: 0,
  });
  const [activeTab, setActiveTab] = useState("problem");
  const key = `${titleSlug}-${activeLanguage}-code`;

  useEffect(() => {
    if (activeTab === "submissions") {
      (async () => {
        const res = await getSubmissionsForProblemByTitleSlug(titleSlug);
        setSubmissions(res);
      })();
    }
  }, [activeTab]);

  const fetchProblem = async () => {
    setIsLoading(true);
    try {
      const res = await fetchPublicProblemByTitleSlug(titleSlug);
      console.log({ res });
      setProblem({
        title: res.title,
        description: res.description,
        testCases: res.testCases,
        id: res.id,
        titleSlug: res.titleSlug,
        difficulty: res.difficulty,
        problemNumber: res.problemNumber,
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
    // TODO: fix it, better error handling.
    if (!problem) {
      return null;
    }
    try {
      const res = await executeTestRun({
        code,
        language: activeLanguage,
        problemId: problem.id,
        testCases,
      });
      console.log({ res });

      return res;
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 429) {
        toast({
          title: "Too many test runs",
          description: `Please try again after ${err.response.headers["retry-after"]} seconds.`,
          variant: "destructive",
        });

        console.error(
          "Rate limit exceeded. Please try again later.",
          err.response.data.message
        );
        return null;
      }
      console.error(err);
      return null;
    }
  };
  const handleSubmission = async () // data: Omit<CreateSubmissionDTO, "userId">
  : Promise<void> => {
    // TODO: fix it, better error handling.
    if (!problem) {
      return;
    }
    try {
      const res = await createSubmission({
        problemId: problem.id,
        code,
        language: activeLanguage,
      });
      console.log({ res }, "submission...");
      await handleFetchSubmissoins();
      setActiveTab("submissions");
    } catch (e) {
      if (e instanceof AxiosError && e.response?.status === 429) {
        toast({
          title: "Too many submissions",
          description: `Please try again after ${e.response.headers["retry-after"]} seconds.`,
          variant: "destructive",
        });
        console.error(
          "Rate limit exceeded. Please try again later.",
          e.response.data.message
        );
        return;
      }
      console.log(e);
    }
  };

  const handleFetchSubmissoins = async () => {
    try {
      const res = await getSubmissionsForProblemByTitleSlug(titleSlug);
      res.submissions.sort((a, b) => {
        return b.timestamp - a.timestamp;
      });
      setSubmissions(res);
      // setActiveTab("submissions");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    void fetchProblem();
    void handleFetchSubmissoins();
    const locallySavedCode = localStorage.getItem(key);
    if (locallySavedCode) setCode(locallySavedCode);
  }, []);

  // Handle code change: Saving etc...
  useEffect(() => {
    localStorage.setItem(key, code);
    console.log("saved", code);
  }, [code]);

  useEffect(() => {
    if (renderCount < 2) {
      renderCount++;
      return;
    }
    const locallySavedCode = localStorage.getItem(key);
    setCode(locallySavedCode || "");
  }, [activeLanguage]);

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
                      lastSubmittedCode={
                        submissions.submissions.find(
                          (submission) => submission.language === activeLanguage
                        )?.code
                      }
                    />
                  </div>
                </ResizablePanel>
                <ResizableHandle
                  className="bg-secondary hover:bg-primary"
                  withHandle
                />
                <ResizablePanel defaultSize={45}>
                  <div className="w-full h-full p-4 pb-5">
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
