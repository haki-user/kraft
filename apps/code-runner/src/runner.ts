import amqp from "amqplib";
import { Job, ExecutionResult, ExecutorConfig } from "@kraft/types";

const QUEUE_NAME = "submission-queue";
const RESULT_EXCHANGE = "execution-results";

export class RunnerService {
  private executors: ExecutorConfig[] = [];
  private channel: amqp.Channel | null = null;

  // Initialize RabbitMQ connection and channel
  async initialize() {
    try {
      const conn = await amqp.connect("amqp://localhost");
      this.channel = await conn.createChannel();
      await this.channel.assertQueue(QUEUE_NAME, { durable: true });
      await this.channel.assertQueue(RESULT_EXCHANGE, { durable: true });
      console.log("RabbitMQ connection established and queues asserted.");
    } catch (error) {
      console.error("Failed to initialize RabbitMQ:", error);
      throw error;
    }
  }

  // Register a new executor
  async registerExecutor(config: ExecutorConfig) {
    if (!config.language || !config.endpoint) {
      throw new Error("Invalid executor configuration");
    }
    this.executors.push(config);
    console.log(
      `Executor for ${config.language} registered at ${config.endpoint}`
    );
  }

  // Remove an executor by language.
  async removeExecutor(language: string) {
    const index = this.executors.findIndex((e) => e.language === language);
    if (index === -1) {
      throw new Error("Executor not found");
    }
    this.executors.splice(index, 1);
    console.log(`Executor for ${language} removed`);
  }

  // List registered executors.
  async listExecutors() {
    return this.executors;
  }

  // Process jobs from the queue
  async processJobs() {
    if (!this.channel) {
      throw new Error("RabbitMQ channel not initialized");
    }

    this.channel.consume(QUEUE_NAME, async (msg) => {
      if (!msg) {
        console.error("Received null message from queue");
        return;
      }

      try {
        const job: Job = JSON.parse(msg.content.toString());
        console.log(`Processing job ${job.id} for ${job.language}`);

        const executor = this.executors.find(
          (e) => e.language === job.language
        );
        if (!executor) {
          // throw new Error(`No executor registered for ${job.language}`);
          console.log(`No executor registered for ${job.language}`);
          return;
        }

        const result = await this.executeJob(job, executor.endpoint);
        console.log(result);
        this.channel?.sendToQueue(
          RESULT_EXCHANGE,
          Buffer.from(JSON.stringify(result)),
          { persistent: true }
        );
        console.log(`Job ${job.id} completed successfully`);
      } catch (error) {
        console.error(`Job processing failed:`, error);
        this.channel?.nack(msg, false, false); // Reject the message
      } finally {
        this.channel?.ack(msg); // Acknowledge the message
      }
    });
  }

  // Execute a job by sending it to the appropriate executor
  private async executeJob(
    job: Job,
    endpoint: string
  ): Promise<ExecutionResult> {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });

      if (!response.ok) {
        throw new Error(
          `Executor returned ${response.status}: ${response.statusText}`
        );
      }

      const result: ExecutionResult =
        (await response.json()) as ExecutionResult; // Type assertion. Fix it later
      return result;
    } catch (error) {
      console.error(`Failed to execute job ${job.id}:`, error);
      throw error;
    }
  }
}

// // Start the service
// (async () => {
//   try {
//     const runner = new RunnerService();
//     await runner.initialize();

//     // Register executors (example)
//     await runner.registerExecutor({
//       language: "python",
//       // endpoint: "http://python-executor:3000/execute",
//       endpoint:
//     });

//     await runner.registerExecutor({
//       language: "javascript",
//       endpoint:
//     });

//     await runner.processJobs();
//     console.log("Runner service started and processing jobs.");
//   } catch (error) {
//     console.error("Failed to start runner service:", error);
//     process.exit(1);
//   }
// })();
