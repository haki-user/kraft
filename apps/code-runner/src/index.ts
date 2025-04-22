import express from "express";
import type { Request, Response } from "express";
import { RunnerService } from "./runner";
import { ExecutorConfig } from "@kraft/types";
import { config } from "./config";

const PORT = config.PORT;

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

    // simple html dashboard that shows executor count, add and delete options
    app.get("/", async (_req: Request, res: Response) => {
      res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Admin Dashboard</title>
        <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { width: 80%; margin: 20px auto; background: #fff; padding: 20px; border-radius: 5px; }
        input, button { padding: 10px; margin: 5px; }
        .executor-item { margin-bottom: 5px; }
        .delete-button { margin-left: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
        <h1>Admin Dashboard</h1>
        <h2>Registered Executors (<span id="executorCount">0</span>)</h2>
        <button onclick="fetchExecutors()">Refresh List</button>
        <ul id="executorList"></ul>
        <h3>Add Executor</h3>
        <input type="text" id="language" placeholder="Language">
        <input type="text" id="endpoint" placeholder="Endpoint">
        <button onclick="addExecutor()">Add Executor</button>
        <p id="actionResult"></p>
        </div>
        <script>
        async function fetchExecutors() {
          try {
          const response = await fetch('/api/executors');
          const executors = await response.json();
          const list = document.getElementById('executorList');
          const countSpan = document.getElementById('executorCount');
          list.innerHTML = '';
          executors.forEach(exe => {
            const li = document.createElement('li');
            li.className = 'executor-item';
            li.textContent = exe.language + ': ' + exe.endpoint;
            
            const delButton = document.createElement('button');
            delButton.textContent = 'Delete';
            delButton.className = 'delete-button';
            delButton.onclick = async () => {
            try {
              const delResponse = await fetch('/api/executors/' + encodeURIComponent(exe.language), { method: 'DELETE' });
              const delResult = await delResponse.text();
              document.getElementById('actionResult').innerText = delResult;
              fetchExecutors();
            } catch (error) {
              console.error(error);
            }
            };
            
            li.appendChild(delButton);
            list.appendChild(li);
          });
          countSpan.textContent = executors.length;
          } catch (error) {
          console.error(error);
          }
        }
        
        async function addExecutor() {
          const language = document.getElementById('language').value;
          const endpoint = document.getElementById('endpoint').value;
          try {
          const response = await fetch('/api/executors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language, endpoint })
          });
          const resultText = await response.text();
          document.getElementById('actionResult').innerText = resultText;
          fetchExecutors();
          } catch (error) {
          console.error(error);
          }
        }
        
        // Automatically fetch executors on page load
        fetchExecutors();
        </script>
      </body>
      </html>
      `);
    });

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
