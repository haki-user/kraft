import {
  ServiceBusClient,
  ServiceBusSender,
  ServiceBusReceiver,
} from "@azure/service-bus";
import type {
  Job,
  ExecutionResult,
  ExecutorConfig,
  TestCase,
} from "@kraft/types";
import {
  loadExecutors,
  upsertExecutor,
  deleteExecutor,
  syncJobResult,
} from "./db";
import { config } from "./config";

const connectionString = config.AZURE_SERVICE_BUS_CONNECTION_STRING;
const jobsQueueName = config.AZURE_SERVICE_BUS_JOBS_QUEUE_NAME;
const processedJobsQueueName =
  config.AZURE_SERVICE_BUS_PROCESSED_JOBS_QUEUE_NAME;

// The Service Bus client and senders are created as global constants to ensure that only one instance of each is created and shared across the entire application.
const sbClient = new ServiceBusClient(connectionString);
const jobSender: ServiceBusSender = sbClient.createSender(jobsQueueName);
const processedJobSender: ServiceBusSender = sbClient.createSender(
  processedJobsQueueName
);

export class RunnerService {
  private executors: ExecutorConfig[] = [];

  // Initialize the Runner Service.
  async initialize(): Promise<void> {
    console.log("Initializing Azure Service Bus...");
    await this.loadExecutorsFromDB();
  }

  // Load executors from the database to sync the in-memory state.
  private async loadExecutorsFromDB(): Promise<void> {
    try {
      const rows = await loadExecutors();
      this.executors = rows.map((row) => ({
        language: row.language,
        endpoint: row.endpoint,
      }));
      console.log(`Loaded ${this.executors.length} executors from database.`);
    } catch (error) {
      console.error("Error loading executors from database:", error);
    }
  }

  // Register a new executor and sync with the database.
  async registerExecutor(config: ExecutorConfig): Promise<void> {
    if (!config.language || !config.endpoint) {
      throw new Error("Invalid executor configuration");
    }
    try {
      await upsertExecutor(config.language, config.endpoint);
      const index = this.executors.findIndex(
        (e) => e.language.toLowerCase() === config.language.toLowerCase()
      );
      if (index >= 0) {
        this.executors[index] = config;
      } else {
        this.executors.push(config);
      }
      console.log(
        `Executor for language ${config.language} registered and synced to database.`
      );
    } catch (error) {
      console.error("Error registering executor in database:", error);
      throw error;
    }
  }

  // Remove an executor by language and sync the change to the database.
  async removeExecutor(language: string): Promise<void> {
    const index = this.executors.findIndex(
      (e) => e.language.toLowerCase() === language.toLowerCase()
    );
    if (index === -1) {
      throw new Error("Executor not found");
    }
    try {
      await deleteExecutor(language);
      this.executors.splice(index, 1);
      console.log(
        `Executor for language ${language} removed and synced to database.`
      );
    } catch (error) {
      console.error("Error removing executor from database:", error);
      throw error;
    }
  }

  // List all registered executors.
  async listExecutors(): Promise<ExecutorConfig[]> {
    return this.executors;
  }

  // Submit a job to the jobs queue.
  async submitJob(job: Job): Promise<void> {
    try {
      await jobSender.sendMessages({
        body: job,
        subject: "JobSubmission",
      });
      console.log(`Job ${job.id} submitted.`);
    } catch (error) {
      console.error("Failed to submit job:", error);
    }
  }

  // Continuously listen for new jobs from the jobs queue.
  async processJobs(): Promise<void> {
    const receiver: ServiceBusReceiver = sbClient.createReceiver(jobsQueueName);
    receiver.subscribe({
      processMessage: async (message) => {
        const job = message.body as Job;
        console.log(`Received job ${job.id}`);
        try {
          await this.processJob(job);
          // await syncJobResult(job.id, true);
          await receiver.completeMessage(message);
        } catch (error) {
          console.error(`Error processing job ${job.id}:`, error);
          // await syncJobResult(job.id, false);
          await receiver.abandonMessage(message);
        }
      },
      processError: async (err) => {
        console.error("Error receiving jobs:", err);
      },
    });
    console.log("Started listening for jobs.");
  }

  // Process a job by selecting an executor and executing it.
  async processJob(job: Job): Promise<void> {
    const executor = this.executors.find(
      (e) => e.language.toLowerCase() === job.language.toLowerCase()
    );
    if (!executor) {
      console.error(`No executor registered for language ${job.language}.`);
      throw new Error("No executor registered");
    }
    const MAX_MESSAGE_SIZE = 256 * 1000; // bytes

    try {
      const executionResult: ExecutionResult = await this.executeJob(
        job,
        executor.endpoint
      );

      // Prepare message payload
      let payload = {
        jobId: job.id,
        result: executionResult,
        isTestRun: job.isTestRun,
      };
      let payloadStr = JSON.stringify(payload);

      // If exceeding size limit, modify payload (e.g. remove or truncate large fields)
      if (Buffer.byteLength(payloadStr) > MAX_MESSAGE_SIZE) {
        payload = {
          ...payload,
          result: {
            jobId: job.id,
            status: "RUNTIME_ERROR",
            stderr: "Output limit exceeded",
            results: [],
            testCasesPassed: 0,
            totalTestCases: 0,
            runtime: 0,
            memoryUsed: 0,
          },
        };
      }

      await processedJobSender.sendMessages({
        body: payload,
        subject: "JobProcessed",
      });
      console.log(`Job ${job.id} processed and result sent.`);
    } catch (error) {
      // if azure function rejects due to function timeout limit
      if (
        error instanceof Error &&
        (error.message.includes("timeout") ||
          error.message.includes("statusCode: 500"))
      ) {
        const payload = {
          jobId: job.id,
          isTestRun: job.isTestRun,
          result: {
            jobId: job.id,
            status: "TIME_LIMIT_EXCEEDED",
            stderr: "Execution time limit exceeded.",
            results: [],
            testCasesPassed: 0,
            totalTestCases: 0,
            runtime: 0,
            memoryUsed: 0,
          },
        };
        await processedJobSender.sendMessages({
          body: payload,
          subject: "JobProcessed",
        });
        return;
      }
      console.error(`Error processing job ${job.id}:`, error);
      throw error;
    }
  }

  // Execute the job by calling the executor's HTTP endpoint.
  async executeJob(job: Job, endpoint: string): Promise<ExecutionResult> {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          code: job.code,
          language: job.language,
          isTestRun: job.isTestRun,
          testCases: processTestCases(job.testCases),
        }),
      });
      if (!response.ok) {
        throw new Error(
          `Execution failed: ${response.statusText}, statusCode: ${response.status}`
        );
      }
      return (await response.json()) as ExecutionResult;
    } catch (error: any) {
      console.error(`Execution error for job ${job.id}: ${error.message}`);
      throw error;
    }
  }
}

const flattenValues = (value: any): string => {
  if (Array.isArray(value)) {
    return value.map(flattenValues).join(" ");
  } else if (typeof value === "object" && value !== null) {
    return Object.values(value).map(flattenValues).join(" ");
  } else {
    return String(value);
  }
};

const processTestCases = (testCases: TestCase[]) => {
  // -- rename it later on
  return testCases.map((testCase) => {
    const { input, expectedOutput, id } = testCase;
    const inputStr = input.map(flattenValues).join("\n");
    return {
      id,
      input,
      inputStr,
      expectedOutput,
    };
  });
};
