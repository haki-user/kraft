import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { Client as PGClient } from "pg";
import { config } from "./config";

const postgresConnectionString = config.POSTGRES_CONNECTION_STRING;
const caCert = fs.readFileSync(config.AIVEN_CA_CERT_PATH).toString();

// Create and connect the Postgres client.
export const pgClient = new PGClient({
  connectionString: postgresConnectionString,
  ssl: {
    ca: caCert,
    rejectUnauthorized: true,
  },
  query_timeout: 10 * 1000, // 5 seconds
});
pgClient
  .connect()
  .then(() => console.log("Postgres client connected."))
  .catch((err) => {
    console.error("Failed to connect to Postgres:", err);
    process.exit(1);
  });

// Load executors from the database.
export async function loadExecutors(): Promise<
  { language: string; endpoint: string }[]
> {
  const result = await pgClient.query(
    `SELECT language, endpoint FROM "Executors"`
  );
  return result.rows;
}

// Insert or update an executor in the database.
export async function upsertExecutor(
  language: string,
  endpoint: string
): Promise<void> {
  await pgClient.query(
    `INSERT INTO "Executors" (id, language, endpoint) VALUES ($1, $2, $3)`,
    [uuidv4(), language, endpoint]
  );
}

// Delete an executor from the database.
export async function deleteExecutor(language: string): Promise<void> {
  await pgClient.query(`DELETE FROM "Executors" WHERE language = $1`, [
    language,
  ]);
}

// Synchronize job results with Postgres.
export async function syncJobResult(
  jobId: string,
  success: boolean
): Promise<void> {
  try {
    const query = `INSERT INTO "JobResults" (jobId, success, processedAt) VALUES ($1, $2, NOW())`;
    await pgClient.query(query, [jobId, success]);
    console.log(
      `Job ${jobId} result synced to Postgres with status: ${success}`
    );
  } catch (error) {
    console.error(`Failed to sync job ${jobId} result to Postgres:`, error);
  }
}
