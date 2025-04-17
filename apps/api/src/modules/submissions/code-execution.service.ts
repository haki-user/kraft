import type { TestCase, SubmissionStatus } from "@kraft/types";
import { spawn } from "child_process";
import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs/promises";
// import * as fsSync from "fs";
import * as path from "path";
import type { TestRunResult } from "@kraft/types";
// import e from "express";

const execAsync = promisify(exec);

interface ExecutorResult {
  input?: string;
  output?: string;
  expectedOutput?: string;
  error?: string;
  testCasesPassed?: number;
  totalTestCases?: number;
  status: SubmissionStatus;
  memoryUsed: number;
  runtime: number;
  results?: TestRunResult[];
}

const formatInput = (input: Record<string, any>[]): string => {
  const formattedLines: string[] = [];
  input.forEach((inpt) => {
    for (const value of Object.values(inpt)) {
      if (Array.isArray(value)) {
        // Just join array elements with spaces, no stringification
        formattedLines.push(value.join(" "));
      } else {
        // For non-array values, just convert to string
        formattedLines.push(String(value));
      }
    }
  });
  return formattedLines.join("\n");
};

const createTempFile = async (
  content: string,
  extension: string
): Promise<string> => {
  const fileName = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 15)}${extension}`;
  const filePath = path.join("/tmp", fileName);
  await fs.writeFile(filePath, content);
  return filePath;
};

const executeCode = async (
  code: string,
  input: string,
  language: string
): Promise<{ output: string; runtime: number; memoryUsed: number }> => {
  const startTime = process.hrtime();
  let filePath: string | null = null;

  try {
    switch (language.toLowerCase()) {
      case "python":
        // Create temporary files for code and input
        filePath = await createTempFile(code, ".py");
        const inputFilePath = await createTempFile(input, ".txt");

        // Define memory limit (in KB) and output limit (in characters)
        const memoryLimitKB = 256 * 1024; // 256 MB in KB
        const outputLimit = 10000; // maximum allowed output characters

        // Spawn the child process using bash to set memory limit via ulimit
        const command = `ulimit -v ${memoryLimitKB} > /dev/null 2>&1 && python ${filePath}`;
        const child = spawn("bash", ["-c", command], { shell: true });

        let stdout = "";
        let stderr = "";

        // Pass the input content via stdin
        child.stdin.write(input);
        child.stdin.end();

        // Monitor stdout data and enforce output limit
        child.stdout.on("data", (data) => {
          const text = data.toString();
          stdout += text;
          if (stdout.length > outputLimit) {
            child.kill("SIGTERM");
            stderr += "\nOutput limit exceeded.";
          }
        });

        child.stderr.on("data", (data) => {
          stderr += data.toString();
        });

        const timeout = 5000;
        const timeoutPromise = new Promise<never>((_resolve, reject) => {
          const timer = setTimeout(() => {
            child.kill("SIGTERM");
            reject(new Error("Timeout exceeded"));
          }, timeout);
          child.on("exit", () => clearTimeout(timer));
        });

        const childPromise = new Promise<{ stdout: string; stderr: string }>(
          (resolve, reject) => {
            child.on("error", (error) => reject(error));
            child.on("close", (code) => {
              if (code !== 0) {
                return reject(
                  new Error(stderr || `Process exited with code ${code}`)
                );
              }
              resolve({ stdout, stderr });
            });
          }
        );

        const { stdout: commandOutput, stderr: commandError } =
          await Promise.race([childPromise, timeoutPromise]);

        if (stderr) throw new Error(stderr);
        const output = stdout.trim();

        // Get execution stats
        const [seconds, nanoseconds] = process.hrtime(startTime);
        const runtime = seconds * 1000 + nanoseconds / 1000000; // Convert to milliseconds

        // Get memory usage (this is approximate)
        const { stdout: memoryOutput } = await execAsync(
          `ps -o rss= -p ${process.pid}`
        );
        const memoryUsed = parseInt(memoryOutput.trim()) / 1024; // Convert KB to MB

        // // Cleanup input file
        await fs.unlink(inputFilePath).catch(() => {});

        return { output, runtime, memoryUsed };

      // Add support for other languages here
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  } finally {
    // Cleanup temp file
    if (filePath) {
      await fs
        .unlink(filePath)
        .catch((e) => console.log(`Failed to delete file: ${filePath}`, e));
    }
  }
};

const executor = async (
  code: string,
  testCases: TestCase[],
  isTestRun = false,
  language = "python"
): Promise<ExecutorResult> => {
  try {
    if (isTestRun) {
      const test = async (testCase: TestCase) => {
        const formattedInput = formatInput(testCase.input);
        const start = Date.now();
        const { output, runtime, memoryUsed } = await executeCode(
          code,
          formattedInput,
          language
        );
        const elapsed = Date.now() - start;
        if (elapsed > 5000) {
          throw new Error("Time Limit Exceeded");
        }

        const status: SubmissionStatus =
          output === testCase.expectedOutput ? "ACCEPTED" : "WRONG_ANSWER";

        return {
          input: formattedInput,
          output,
          expectedOutput: testCase.expectedOutput,
          memoryUsed,
          runtime,
          status,
          testCase,
        };
      };

      const results = await Promise.all(
        testCases.map((testCase) => test(testCase))
      );

      return {
        memoryUsed: results.reduce((acc, { runtime }) => runtime + acc, 0),
        runtime: results.reduce((acc, { memoryUsed }) => memoryUsed + acc, 0),
        status: results.every(({ status }) => status === "ACCEPTED")
          ? ("ACCEPTED" as SubmissionStatus)
          : ("WRONG_ANSWER" as SubmissionStatus),
        results: results.map((result) => {
          return {
            output: result.output,
            testCase: result.testCase,
            runtime: result.runtime,
            memoryUsed: result.memoryUsed,
            stderr: "",
            status: result.status, // This is now directly a SubmissionStatus
          };
        }),
      };
    } else {
      const totalTestCases = testCases.length;
      let testCasesPassed = 0;
      let totalRuntime = 0;
      let maxMemoryUsed = 0;

      for (const testCase of testCases) {
        const formattedInput = formatInput(testCase.input);

        const { output, runtime, memoryUsed } = await executeCode(
          code,
          formattedInput,
          language
        );

        console.log(
          output,
          typeof testCase.expectedOutput,
          typeof output.trim(),
          testCase.expectedOutput.trim(),
          testCase.expectedOutput.trim() === output.trim(),
          testCase.expectedOutput === output
        );
        if (output.trim() === testCase.expectedOutput.trim()) {
          console.log("passed");
          testCasesPassed++;
        }

        totalRuntime += runtime;
        maxMemoryUsed = Math.max(maxMemoryUsed, memoryUsed);
      }

      let status: SubmissionStatus;
      console.log({ testCasesPassed, totalTestCases });
      if (testCasesPassed === totalTestCases) {
        status = "ACCEPTED";
      } else {
        status = "WRONG_ANSWER";
      }

      return {
        testCasesPassed,
        totalTestCases,
        status,
        memoryUsed: maxMemoryUsed,
        runtime: totalRuntime / totalTestCases, // Average runtime
      };
    }
  } catch (err) {
    console.log("Error:", err);
    const errorMessage = (err as Error)?.message || "";
    const stdout = ((err as any)?.stdout as string) || "";

    const stderr = ((err as any)?.stderr as string) || "";

    // Check for specific error types
    if (stderr.includes("SyntaxError")) {
      return {
        error: "stderr: " + stderr,
        status: "RUNTIME_ERROR",
        memoryUsed: 0,
        runtime: 0,
      };
    }
    if (stderr.includes("timeout")) {
      return {
        error: errorMessage + "\nstderr: " + stderr,
        status: "TIME_LIMIT_EXCEEDED",
        memoryUsed: 0,
        runtime: 0,
        output: stdout,
      };
    }

    if (stderr.includes("Killed") || errorMessage.includes("Buffer")) {
      return {
        error: errorMessage + "\nstderr: " + stderr,
        status: "MEMORY_LIMIT_EXCEEDED",
        memoryUsed: 0,
        runtime: 0,
        output: stdout,
      };
    }

    return {
      error: errorMessage + "\nstderr: " + stderr,
      status: "RUNTIME_ERROR",
      memoryUsed: 0,
      runtime: 0,
      output: stdout,
    };
  }
};

export default executor;

// // Example 1: Test Run with Array Sum Problem
// async function testArraySum() {
//   // Python code that sums numbers in an array
//   const pythonCode = `
// nums = list(map(int, input().split()))
// print(sum(nums))
//     `;

//   const testCase: TestCase = {
//     id: "1",
//     isPublic: true,
//     problemId: "XX",
//     input: [{ nums: [1, 2, 3, 4, 5] }],
//     expectedOutput: "15",
//   };

//   const result = await executor(pythonCode, [testCase], true, "python");
//   console.log("Test Run Result:", result);
// }

// // Example 2: Two Sum Problem Submission
// async function testTwoSum() {
//   // Python code that finds two numbers that add up to target
//   const pythonCode = `
// nums = list(map(int, input().split()))
// target = int(input())

// def two_sum(nums, target):
//     seen = {}
//     for i, num in enumerate(nums):
//         complement = target - num
//         if complement in seen:
//             return f"{seen[complement]} {i}"
//         seen[num] = i
//     return "Not found"

// print(two_sum(nums, target))
//     `;

//   const testCases: TestCase[] = [
//     {
//       id: "1",
//       problemId: "11",
//       isPublic: true,
//       input: [{ nums: [2, 7, 11, 15] }, { target: 9 }],
//       expectedOutput: "0 1",
//     },
//   ];

//   const result = await executor(pythonCode, testCases, false, "python");
//   console.log("Submission Result:", result);
// }

// // Example 3: Test Run with Error Case
// async function testError() {
//   const pythonCode = `
// # This code has a syntax error
// while True print('Hello world')
//     `;

//   const testCase: TestCase = {
//     id: "1",
//     isPublic: true,
//     problemId: "22",
//     input: [],
//     expectedOutput: "",
//   };

//   const result = await executor(pythonCode, [testCase], true, "python");
//   console.log("Error Test Result:", result);
// }

// // Example usage:
// async function runExamples() {
//   try {
//     console.log("Running Array Sum Test...");
//     await testArraySum();

//     console.log("\nRunning Two Sum Submission...");
//     await testTwoSum();

//     console.log("\nRunning Error Test...");
//     await testError();
//   } catch (error) {
//     console.error("Error running examples:", error);
//   }
// }

// runExamples();

// import type { TestCase, SubmissionStatus } from "@kraft/types";

// interface ExecutorResult {
//   input?: string;
//   output?: string;
//   expectedOutput?: string;
//   error?: string;
//   testCasesPassed?: number;
//   totalTestCases?: number;
//   status?: SubmissionStatus;
//   memoryUsed: number;
//   runtime: number;
// }

// const formatInput = (input: Record<string, any>): string => {
//   const formattedLines: string[] = [];

//   for (const [key, value] of Object.entries(input)) {
//     if (Array.isArray(value)) {
//       // Handle arrays by joining with spaces
//       formattedLines.push(value.join(" "));
//     } else {
//       // Handle primitive values
//       formattedLines.push(String(value));
//     }
//   }

//   return formattedLines.join("\n");
// };

// export const executor = (
//   code: string,
//   testCases: TestCase[],
//   isTestRun = false
// ): ExecutorResult => {
//   // Simulate code execution time
//   const runtime = Math.random() * 1000; // Random runtime between 0-1000ms
//   const memoryUsed = Math.random() * 50; // Random memory usage between 0-50MB

//   // Simulate time limit exceeded
//   if (runtime > 950) {
//     return {
//       error: "Time Limit Exceeded",
//       status: "TIME_LIMIT_EXCEEDED",
//       memoryUsed,
//       runtime,
//     };
//   }

//   if (isTestRun) {
//     // For test run, return single test case result
//     const testCase = testCases[0];
//     const formattedInput = formatInput(testCase.input as Record<string, any>);

//     return {
//       input: formattedInput,
//       output: "Mock output for test case",
//       expectedOutput: testCase.expectedOutput,
//       memoryUsed,
//       runtime,
//     };
//   } else {
//     // For submission, evaluate all test cases
//     const totalTestCases = testCases.length;
//     // Simulate random number of passed test cases
//     const testCasesPassed = Math.floor(Math.random() * (totalTestCases + 1));

//     // Determine submission status
//     let status: ExecutorResult["status"];
//     if (testCasesPassed === totalTestCases) {
//       status = "ACCEPTED";
//     } else {
//       status = "WRONG_ANSWER";
//     }

//     return {
//       testCasesPassed,
//       totalTestCases,
//       status,
//       memoryUsed,
//       runtime,
//     };
//   }
// };
