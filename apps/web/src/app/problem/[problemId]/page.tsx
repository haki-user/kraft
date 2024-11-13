import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@kraft/ui";
import EditorC from "@/components/editor";
import { ExecutionPanel } from "@/components/execution-panel";
// import { useToast } from "@/hooks/use-toast";

type TestCaseInput = Record<string, string>;

interface TestCase {
  readonly id: number;
  input: TestCaseInput[];
  outpt?: string;
}

export default function Problem({
  params,
}: {
  params: { problemId: string };
}): JSX.Element {
  const initialTestCases: TestCase[] = [
    {
      id: 1,
      input: [{ nums: "1, 2, 3" }, { k: "2" }],
    },
    {
      id: 2,
      input: [{ nums: "3, 4, 5" }, { nums2: "5, 6, 7, 8" }],
    },
  ];
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
                  <EditorC />
                </div>
              </ResizablePanel>
              <ResizableHandle className="border-2 border-gray-400" />
              <ResizablePanel>
                <div className="w-full h-full">
                  <ExecutionPanel initialTestCases={initialTestCases} />
                  {/* <div className="flex justify-between p-2">
                    <div className="flex gap-5">
                      <div>Test Cases</div>
                      <div>Test Result</div>
                    </div>
                    <div className="flex gap-5">
                      <div>Run</div>
                      <div>Submit</div>
                    </div>
                  </div>
                  <div>
                    {true ? (
                      <div>
                        <div className="flex gap-5">
                          <div>Case 1</div>
                        </div>
                        <TestCasesTab testCase={1} />
                      </div>
                    ) : (
                      <div>
                        <div className="flex gap-5">
                          <div>Case 1</div>
                        </div>
                        <TestResultsTab testCase={1} />
                      </div>
                    )}
                  </div> */}
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

function TestCasesTab({ testCase }: { testCase: number }): JSX.Element {
  return (
    <div>
      <div>{testCase}</div>
    </div>
  );
}

function TestResultsTab({ testCase }: { testCase: number }): JSX.Element {
  return (
    <div>
      <div>{testCase}</div>
    </div>
  );
}
