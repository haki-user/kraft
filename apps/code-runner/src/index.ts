// import { connectQueue, getJob, publishResult, closeQueue } from './queue';
// import { executeJob } from './executor';

// async function startWorker() {
//   await connectQueue();
//   console.log('Worker started');

//   process.on('SIGINT', async () => {
//     console.log('Shutting down worker...');
//     await closeQueue();
//     process.exit(0);
//   });

//   while (true) {
//     const job = await getJob();
//     if (!job) {
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       continue;
//     }

//     try {
//       const result = await executeJob(job);
//       await publishResult(result);
//       console.log({result})
//     } catch (error) {
//       console.error(`Job ${job.id} failed:`, error);
//       await publishResult({
//         jobId: job.id,
//         status: 'runtime_error',
//         results: [],
//         totalPassed: 0,
//         totalCases: job.testCases.length,
//         averageRuntime: 0,
//         maxMemory: 0
//       });
//     }
//   }
// }

// startWorker();

import express from "express";
import type { Request, Response } from "express";
import { RunnerService } from "./runner";
import { ExecutorConfig } from "@kraft/types";

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    // Initialize the runner service.
    const runner = new RunnerService();
    await runner.initialize();

    // // Optionally, register default executors.
    // const pythonExecutor: ExecutorConfig = {
    //   language: "python",
    //   endpoint: ""
    // };
    // const jsExecutor: ExecutorConfig = {
    //   language: "javascript",
    //   endpoint: ""
    // };
    // await runner.registerExecutor(pythonExecutor);
    // await runner.registerExecutor(jsExecutor);

    // Start processing jobs from the queue.
    runner.processJobs();
    console.log("Runner service started processing jobs.");

    // Set up the Express admin API.
    const app = express();
    app.use(express.json());

    // Endpoint to add a new executor.
    app.post(
      "/api/executors",
      async (req: Request, res: Response): Promise<any> => {
        const config: ExecutorConfig = req.body;
        if (!config.language || !config.endpoint) {
          return res.status(400).send("Invalid config");
        }
        try {
          await runner.registerExecutor(config);
          res.status(201).send(`Executor for ${config.language} registered`);
        } catch (error: any) {
          res.status(500).send(error.message);
        }
      }
    );

    // Endpoint to remove an executor.
    app.delete("/api/executors/:language", async (req, res) => {
      const language = req.params.language;
      try {
        await runner.removeExecutor(language);
        res.status(200).send(`Executor for ${language} removed`);
      } catch (error: any) {
        res.status(404).send(error.message);
      }
    });

    // Endpoint to list registered executors.
    app.get("/api/executors", async (req, res) => {
      const executors = await runner.listExecutors();
      res.json(executors);
    });

    app.listen(PORT, () => {
      console.log(`Admin API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
