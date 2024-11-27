"use client";
import { useState, useCallback, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  // Separator,
  Label,
  Input,
  ScrollArea,
  ScrollBar,
  Button,
  Skeleton,
} from "@kraft/ui";
import { useToast } from "@/hooks/use-toast";
import type {
  CreateSubmissionDTO,
  ExecutorResult,
  SubmissionResult,
  SubmissionStatus,
  TestCase,
  TestRunResult,
} from "@kraft/types";

type TestCaseInput = Record<string, string>;

// interface TestCase {
//   readonly id: string;
//   input: TestCaseInput[];
//   outpt?: string;
// }

interface ExecutionPanelProps {
  handleTestRun: (testCases: TestCase[]) => Promise<ExecutorResult | null>;
  handleSubmission: (
    // data: Omit<CreateSubmissionDTO, "userId">
  ) => Promise<SubmissionResult | null>;
  initialTestCases: TestCase[];
}

type TestStatus = SubmissionStatus;

// interface TestResult {
//   readonly id: number;
//   readonly message?: string;
//   readonly status: TestStatus;
//   readonly output?: string;
//   readonly stderr?: string;
//   readonly input: TestCaseInput[];
//   // readonly stdout?: string;
// }

interface ExecutionResult {
  status: TestStatus;
  message: string;
  output: string;
  stderr?: string;
}

// type ExecutionState = {
//   isExecuting: boolean;
//   error?: Error;
//   progress?: number;
// };

export function ExecutionPanel({
  handleTestRun,
  handleSubmission,
  initialTestCases,
}: ExecutionPanelProps): JSX.Element {
  const [testCases, setTestCases] = useState<TestCase[]>(initialTestCases);
  const [testResults, setTestResults] = useState<TestRunResult[]>([
    // {
    //   id: 1,
    //   status: TestStatus.Pass,
    //   output: `Hello World
    //   HHello Worldello World
    //   HHello Worldello World \n
    //   HHello Worldello World
    //   HHello Worldello World \n
    //   HHello Worldello World
    //   HHello Worldello World
    //   HHello Worldello World
    //   `,
    //   input: [
    //     {
    //       nums: "Hello World",
    //     },
    //     { n: "5" },
    //   ],
    // },
  ]);
  const { toast } = useToast();
  // const handleRun = ()
  useEffect(() => {
    setTestResults([]);
  }, []);
  const [executionResult, setExecutionResult] =
    useState<ExecutionResult | null>();
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    "test-cases" | "test-results" | "skeleton"
  >("test-cases");

  const handleTestCaseInputChange = useCallback(
    (testCaseId: string, key: string, value: string) => {
      setTestCases((prevTestCases) =>
        prevTestCases.map((testCase) =>
          testCase.id === testCaseId
            ? {
                ...testCase,
                input: testCase.input.map((inputItem) =>
                  Object.keys(inputItem)[0] === key
                    ? { [key]: value }
                    : inputItem
                ),
              }
            : testCase
        )
      );
    },
    []
  );

  const handleRun = async (): Promise<void> => {
    setIsExecuting(true);
    setActiveTab("skeleton");
    // const res = await handleTestRun(testCases);
    // console.log({ res }, "zzz");
    // setTestResults(res);
    // setExecutionResult({
    //   status: res.status,
    //   message: "",
    //   output: "",
    // });
    const res: ExecutorResult | null = await handleTestRun(testCases);
    if (!res) return;

    console.log({ res }, "zzz");

    if (res.results) {
      setTestResults(res.results);
    }

    setExecutionResult({
      status: res.status,
      message: "",
      output: "",
    });

    setIsExecuting(false);
    setActiveTab("test-results");
  };

  const handleSubmit = async () => {
    setIsExecuting(true);
    const res = await handleSubmission();
    console.log(res);
    setIsExecuting(false);
  };

  return (
    <Tabs
      className="w-full h-full p-1"
      defaultValue="skeleton"
      // value={`${isExecuting ? "skeleton" : "test-cases"}`}
      value={activeTab}
    >
      <div className="flex justify-between">
        <TabsList>
          <TabsTrigger
            disabled={isExecuting}
            onClick={() => {
              setActiveTab("test-cases");
            }}
            value="test-cases"
          >
            Test Cases
          </TabsTrigger>
          <TabsTrigger
            disabled={isExecuting}
            onClick={() => {
              setActiveTab("test-results");
            }}
            value="test-results"
          >
            Test Results
          </TabsTrigger>
        </TabsList>
        <div className="flex gap-2">
          <Button
            disabled={isExecuting}
            onClick={handleRun}
            variant="secondary"
          >
            Run
          </Button>
          <Button
            className="bg-green-700 hover:bg-green-800 active:bg-green-900"
            disabled={isExecuting}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
      {/* <Separator className="mt-1" /> */}
      <TabsContent className="w-full h-full" value="skeleton">
        <SkeletonCard />
      </TabsContent>
      <TabsContent className="w-full h-full" value="test-cases">
        <Tabs
          className="w-full h-full p-1"
          defaultValue={`test-case-${testCases[0].id}`}
        >
          <TabsList>
            {testCases.map((testCase, idx) => (
              <TabsTrigger key={testCase.id} value={`test-case-${testCase.id}`}>
                Case {idx + 1}
              </TabsTrigger>
            ))}
          </TabsList>
          {/* <Separator className="mt-1" /> */}
          <ScrollArea className="w-full h-[calc(100%-5.2rem)] pt-2">
            {testCases.map(({ id: testCaseId, input }) => (
              <TabsContent
                className="pb-2 px-2"
                key={testCaseId}
                value={`test-case-${testCaseId}`}
              >
                {input.map((item) => {
                  const key = Object.keys(item)[0];
                  const value = item[key];

                  return (
                    <div className="mt-5" key={key}>
                      <Label htmlFor={`test-case-${testCaseId}-input-${key}`}>
                        <span className="text-nowrap text-base">{key}</span>
                      </Label>
                      <Input
                        className="mt-1"
                        id={`test-case-${testCaseId}-input-${key}`}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleTestCaseInputChange(
                            testCaseId,
                            key,
                            e.target.value
                          );
                        }}
                        value={value}
                      />
                    </div>
                  );
                })}
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
      </TabsContent>
      {/* Results */}
      <TabsContent className="w-full h-full" value="test-results">
        {
          // If there are no test results, show a message
          testResults.length === 0 || !executionResult ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-2xl text-gray-500">
                No test results available
              </div>
            </div>
          ) : (
            <div className="w-full h-full">
              {executionResult.status === "COMPILATION_ERROR" ||
              executionResult.status === "RUNTIME_ERROR" ||
              executionResult.status === "MEMORY_LIMIT_EXCEEDED" ||
              executionResult.status === "TIME_LIMIT_EXCEEDED" ? (
                <div>
                  <div className="p-1">
                    <div className="w-full bg-destructive p-5 rounded-md bg-opacity-0 text-destructive-foreground">
                      <Label htmlFor="execution-result-message">
                        <span className="text-nowrap text-base">Error</span>
                      </Label>
                      <div className="text-xs" id="execution-result-message">
                        {executionResult.message}
                      </div>
                    </div>
                    <div className="mt-5">
                      <Label htmlFor="execution-result-output">
                        <span className="text-nowrap text-base">
                          Last Execution Output
                        </span>
                      </Label>
                      <div
                        className="mt-1 flex items-center whitespace-pre-wrap min-h-9 h-content w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        id="execution-result-output"
                      >
                        {executionResult.output}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {executionResult.status !== "COMPILATION_ERROR" &&
              executionResult.status !== "RUNTIME_ERROR" &&
              executionResult.status !== "MEMORY_LIMIT_EXCEEDED" &&
              executionResult.status !== "TIME_LIMIT_EXCEEDED" ? (
                <Tabs
                  className="w-full h-full p-1"
                  defaultValue={`test-result-${1}`}
                >
                  <TabsList>
                    {testResults.map((testResult, idx) => (
                      <TabsTrigger
                        key={testResult.testCase.id}
                        value={`test-result-${idx + 1}`}
                      >
                        Case {idx + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {/* <Separator className="mt-1" /> */}
                  <ScrollArea className="w-full h-[calc(100%-5.2rem)]">
                    <ScrollBar orientation="vertical" />
                    <div>
                      {testResults.map((testResult, idx) => (
                        <TabsContent
                          className="pb-2 px-2"
                          key={testResult.testCase.id}
                          value={`test-result-${idx + 1}`}
                        >
                          <div>
                            {testResult.testCase.input.map((item) => {
                              const key = Object.keys(item)[0];
                              const value = item[key];
                              return (
                                <div className="mt-5" key={key}>
                                  <Label
                                    htmlFor={`test-result-${idx}-input-${key}`}
                                  >
                                    <span className="text-nowrap text-base">
                                      {key}
                                    </span>
                                  </Label>
                                  <Input
                                    className="mt-1"
                                    id={`test-result-${idx}-input-${key}`}
                                    readOnly
                                    value={value}
                                  />
                                </div>
                              );
                            })}
                          </div>
                          <div>
                            <div className="mt-5">
                              <Label htmlFor={`test-result-${idx}-output`}>
                                <span className="text-nowrap text-base">
                                  Output
                                </span>
                              </Label>
                              <div
                                className="mt-1 flex items-center whitespace-pre-wrap min-h-9 h-content w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                id={`test-result-${idx}-output`}
                              >
                                {testResult.output}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="mt-5">
                              <Label
                                htmlFor={`test-result-${idx}-expected-output`}
                              >
                                <span className="text-nowrap text-base">
                                  Expected Output
                                </span>
                              </Label>
                              <div
                                className="mt-1 flex items-center whitespace-pre-wrap h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                id={`test-result-${idx}-expected-output`}
                              >
                                {testResult.testCase.expectedOutput}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="mt-5">
                              <Label htmlFor={`test-result-${idx}-stderr`}>
                                <span className="text-nowrap text-base">
                                  stderr
                                </span>
                              </Label>
                              <div
                                className="mt-1 flex items-center whitespace-pre-wrap h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                id={`test-result-${idx}-stderr`}
                              >
                                {testResult.stderr}
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      ))}
                    </div>
                  </ScrollArea>
                </Tabs>
              ) : null}
            </div>
          )
        }
      </TabsContent>
    </Tabs>
  );
}

function SkeletonCard(): JSX.Element {
  return (
    <div className="flex flex-col p-2">
      <div className="flex gap-2">
        <Skeleton className="w-16 h-7" />
        <Skeleton className="w-16 h-7" />
      </div>
      <div className="pb-2 px-2">
        <Skeleton className="w-[90%] h-7 mt-5" />
        <Skeleton className="w-1/2 h-14 mt-5" />
        <Skeleton className="w-1/4 h-7 mt-5" />
      </div>
    </div>
  );
}
