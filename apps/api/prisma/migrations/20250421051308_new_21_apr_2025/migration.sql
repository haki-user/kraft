/*
  Warnings:

  - Added the required column `points` to the `ContestProblem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContestProblem" ADD COLUMN     "points" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "contestId" TEXT,
ADD COLUMN     "memory" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "runtime" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "executors" (
    "language" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "registered_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "executors_pkey" PRIMARY KEY ("language")
);

-- CreateTable
CREATE TABLE "job_results" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "job_id" TEXT NOT NULL,
    "input" TEXT,
    "output" TEXT,
    "stderr" TEXT,
    "expected_output" TEXT,
    "error" TEXT,
    "test_cases_passed" INTEGER,
    "total_test_cases" INTEGER,
    "status" TEXT NOT NULL,
    "memory_used" REAL NOT NULL,
    "runtime" REAL NOT NULL,
    "processed_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_results_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
