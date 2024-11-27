"use client";
import { useState } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@kraft/ui";
import Editor from "@/components/editor";
import { ExecutionPanel } from "@/components/execution-panel";
import { TestCase, ExecutorResult, SubmissionResult } from "@kraft/types";
import {
  createSubmission,
  executeTestRun,
  getSubmissionsForProblem,
} from "@/services/submissions-service";
// import { useToast } from "@/hooks/use-toast";

// type TestCaseInput = Record<string, string>;

// interface TestCase {
//   readonly id: number;
//   input: TestCaseInput[];
//   outpt?: string;
// }

export default function ProblemPage({
  params,
}: {
  params: { problemId: string };
}): JSX.Element {
  const { problemId } = params;
  const initialTestCases: TestCase[] = [
    {
      id: "1",
      input: [{ nums: "1, 2, 3" }, { k: "2" }],
      isPublic: true,
      problemId: "XX",
      expectedOutput: "3, 4, 5",
    },
    {
      id: "2",
      input: [{ nums: "3, 4, 5" }, { nums2: "5, 6, 7, 8" }],
      isPublic: true,
      problemId: "XX",
      expectedOutput: "8, 9, 10, 11",
    },
  ];
  const languages = ["Python"];
  const [activeLanguage, setActiveLanguage] = useState("Python");
  const [code, setCode] = useState<string>("");

  // const [submissions, setSubmissions] = useState<Submissions>();
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
      return res;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const handleFetchSubmissoins = async () => {
    try {
      const res = await getSubmissionsForProblem(problemId);
      // const cleaned = res.map((submission) => ({
      //   status: submission.status,
      //   runtime: submission.runtime,
      // }));
      // setSubmissions(res);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      {/* <div className="flex debu-1 w-full h-full min-h-[100vh]"> */}
      {/* <div className="h-[calc(100vh-64px)] min-h-screen"> */}
      <div className="h-screen max-h-[92.6vh]">
        <ResizablePanelGroup
          className="w-full h-full min-h[100vh]"
          direction="horizontal"
        >
          <ResizablePanel>
            <div className="debug-2 w-full h-full flex flex-col justify-">
              Problem Id {params.problemId}
              <div>Problem Statement Description</div>
              <div>Input</div>
              <div>Output</div>
              <div>Contraints</div>
              <div>Examples</div>
            </div>
          </ResizablePanel>
          <ResizableHandle className="border-[1px] border-solid border-gray-400" />
          <ResizablePanel className="w-full h-full">
            <ResizablePanelGroup className="w-full h-full" direction="vertical">
              {/* <div className="debug-3"> */}
              <ResizablePanel>
                <div className="">
                  <Editor
                    languages={languages}
                    activeLanguage={activeLanguage}
                    setActiveLanguage={setActiveLanguage}
                    code={code}
                    setCode={setCode}
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle className="border-2 border-gray-400" />
              <ResizablePanel>
                <div className="w-full h-full">
                  <ExecutionPanel
                    handleSubmission={handleSubmission}
                    handleTestRun={handleTestRun}
                    initialTestCases={initialTestCases}
                  />
                </div>
              </ResizablePanel>
              {/* </div> */}
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
