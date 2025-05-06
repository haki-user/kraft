"use client";
import { useState, useCallback, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Label,
  Input,
  ScrollArea,
  ScrollBar,
  Button,
  Skeleton,
  Icons,
} from "@kraft/ui";
import type { ExecutorResult, TestCase, TestResult } from "@kraft/types";

interface ExecutionPanelProps {
  handleTestRun: (testCases: TestCase[]) => Promise<ExecutorResult | null>;
  handleSubmission: () => Promise<void>;
  initialTestCases: TestCase[];
}

export function ExecutionPanel({
  handleTestRun,
  handleSubmission,
  initialTestCases,
}: ExecutionPanelProps): JSX.Element {
  const [testCases, setTestCases] = useState<TestCase[]>(initialTestCases);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  useEffect(() => {
    setTestResults([]);
  }, []);
  const [executionResult, setExecutionResult] =
    useState<ExecutorResult | null>();
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [isExecutingSub, setIsExecutingSub] = useState<boolean>(false);
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
    const res: ExecutorResult | null = await handleTestRun(testCases);
    if (!res) {
      setIsExecuting(false);
      setActiveTab("test-cases");
      return;
    }

    if (res.results) {
      setTestResults(res.results);
    }

    setExecutionResult({
      status: res.status,
      output: res.output,
      stderr: res.stderr,
      error: res.error,
      memoryUsed: res.memoryUsed,
      runtime: res.runtime,
    });
    setIsExecuting(false);
    setActiveTab("test-results");
  };

  const handleSubmit = async () => {
    setIsExecutingSub(true);
    await handleSubmission();
    setIsExecutingSub(false);
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
            disabled={isExecuting || isExecutingSub}
            onClick={() => {
              setActiveTab("test-cases");
            }}
            value="test-cases"
          >
            Test Cases
          </TabsTrigger>
          <TabsTrigger
            disabled={isExecuting || isExecutingSub}
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
            disabled={isExecuting || isExecutingSub}
            onClick={handleRun}
            variant="secondary"
          >
            {isExecuting ? <Icons.spinner className="animate-spin" /> : null}
            Run
          </Button>
          <Button
            className="bg-green-700 hover:bg-green-800 active:bg-green-900"
            disabled={isExecuting || isExecutingSub}
            onClick={handleSubmit}
          >
            {isExecutingSub ? <Icons.spinner className="animate-spin" /> : null}
            Submit
          </Button>
        </div>
      </div>
      {/* <Separator className="mt-1" /> */}
      {/* Accepted + show runtime */}
      <ScrollArea className="w-full h-full max-h-full">
        {executionResult?.status === "ACCEPTED" &&
          activeTab === "test-results" && (
            <div className="bg-background my-4">
              <span className="text-green-700 text-xl">Accepted</span>
              <span className="ml-2 text-sm">
                Runtime: {Math.round(executionResult.runtime)}ms
              </span>
            </div>
          )}
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
                <TabsTrigger
                  key={testCase.id}
                  value={`test-case-${testCase.id}`}
                >
                  Case {idx + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            {/* <Separator className="mt-1" /> */}
            {/* <ScrollArea className="w-full h-[calc(100%-5.2rem)] pt-2"> */}
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
                        readOnly
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
            {/* </ScrollArea> */}
          </Tabs>
        </TabsContent>
        {/* Results */}
        <TabsContent className="w-full h-full" value="test-results">
          {
            // If there are no test results, show a message
            (testResults.length === 0 || !executionResult) &&
            (!executionResult ||
              (executionResult.status !== "COMPILATION_ERROR" &&
                executionResult.status !== "RUNTIME_ERROR" &&
                executionResult.status !== "MEMORY_LIMIT_EXCEEDED" &&
                executionResult.status !== "TIME_LIMIT_EXCEEDED")) ? (
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
                          <span className="text-nowrap text-base">
                            {executionResult.status}
                          </span>
                        </Label>
                        <div className="text-xs" id="execution-result-message">
                          {(executionResult.stderr || "")
                            .split("\n")
                            .map((line, index) => (
                              <div key={index}>{line}</div>
                            ))}
                        </div>
                      </div>
                      <div className="mt-5">
                        <Label>
                          <span className="text-nowrap text-base">
                            Last Execution:
                          </span>
                        </Label>
                      </div>
                      <div>
                        {executionResult.input?.map((item) => {
                          const key = Object.keys(item)[0];
                          const value = item[key];
                          return (
                            <div className="mt-5" key={key}>
                              <Label htmlFor={`test-result-last-input-${key}`}>
                                <span className="text-nowrap text-base">
                                  {key}
                                </span>
                              </Label>
                              <Input
                                className="mt-1"
                                id={`test-result-last-input-${key}`}
                                readOnly
                                value={value}
                              />
                            </div>
                          );
                        })}
                      </div>
                      <div>
                        <div className="mt-5">
                          <Label htmlFor={`test-result-last-output`}>
                            <span className="text-nowrap text-base">
                              Output
                            </span>
                          </Label>
                          <div
                            className="mt-1 mb-1 w-full whitespace-pre-wrap min-h-9 max-h-[30vh] scrollbar-custom overflow-y-scroll rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            // className="mt-1 flex items-center whitespace-pre-wrap min-h-9 h-content w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            id={`test-result-last-output`}
                          >
                            {executionResult.output}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="mt-5">
                          <Label htmlFor={`test-result-last-expected-output`}>
                            <span className="text-nowrap text-base">
                              Expected Output
                            </span>
                          </Label>
                          <div
                            className="mt-1 mb-1 w-full whitespace-pre-wrap min-h-9 max-h-[30vh] scrollbar-custom overflow-y-scroll rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            // className="mt-1 flex items-center whitespace-pre-wrap h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            id={`test-result-last-expected-output`}
                          >
                            {executionResult.expectedOutput}
                          </div>
                        </div>
                      </div>
                      <div className="h-full">
                        <div className="mt-5 h-full">
                          <Label htmlFor={`test-result-last-stderr`}>
                            <span className="text-nowrap text-base">
                              stderr
                            </span>
                          </Label>
                          <div
                            className="mt-1 mb-1 w-full whitespace-pre-wrap min-h-9 max-h-[30vh] scrollbar-custom overflow-y-scroll rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            id={`test-result-last-stderr`}
                          >
                            {executionResult.stderr}
                          </div>
                          {/* </div> */}
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
                      {testResults.map((testResult, idx) => {
                        return (
                          <TabsTrigger
                            key={testResult.id}
                            value={`test-result-${idx + 1}`}
                          >
                            {" "}
                            <span
                              className={`mr-1.5 w-1.5 h-1.5 rounded-full inline-block ${
                                testResult.status === "ACCEPTED"
                                  ? "bg-green-700"
                                  : "bg-destructive"
                              }`}
                            >
                              {" "}
                            </span>
                            Case {idx + 1}
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>
                    {/* <Separator className="mt-1" /> */}
                    {/* <ScrollArea className="w-full h-[calc(100%-5.2rem)]"> */}
                    {/* <ScrollBar orientation="vertical" /> */}
                    <div>
                      {testResults.map((testResult, idx) => (
                        <TabsContent
                          className="pb-2 px-2"
                          key={testResult.id}
                          value={`test-result-${idx + 1}`}
                        >
                          <div>
                            {testResult.input?.map((item) => {
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
                                className="mt-1 mb-1 w-full whitespace-pre-wrap min-h-9 max-h-[30vh] scrollbar-custom overflow-y-scroll rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                // className="mt-1 flex items-center whitespace-pre-wrap min-h-9 h-content w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                id={`test-result-${idx}-output`}
                              >
                                {testResult.stdout}
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
                                className="mt-1 mb-1 w-full whitespace-pre-wrap min-h-9 max-h-[30vh] scrollbar-custom overflow-y-scroll rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                // className="mt-1 flex items-center whitespace-pre-wrap h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                id={`test-result-${idx}-expected-output`}
                              >
                                {testResult.expectedOutput}
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
                                className="mt-1 mb-1 w-full whitespace-pre-wrap min-h-9 max-h-[30vh] scrollbar-custom overflow-y-scroll rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                // className="mt-1 mb-1 flex items-center whitespace-pre-wrap h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm max-h-full"
                                id={`test-result-${idx}-stderr`}
                              >
                                {testResult.stderr}
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      ))}
                    </div>
                    {/* </ScrollArea> */}
                  </Tabs>
                ) : null}
              </div>
            )
          }
        </TabsContent>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
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
