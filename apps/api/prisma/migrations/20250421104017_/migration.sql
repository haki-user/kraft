/*
  Warnings:

  - You are about to drop the `executors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `job_results` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "SubmissionStatus" ADD VALUE 'FAILED';

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "error" TEXT,
ADD COLUMN     "expectedOutput" TEXT,
ADD COLUMN     "input" TEXT,
ADD COLUMN     "output" TEXT,
ADD COLUMN     "stderr" TEXT;

-- DropTable
DROP TABLE "executors";

-- DropTable
DROP TABLE "job_results";

-- CreateTable
CREATE TABLE "Executors" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Executors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobResults" (
    "jobId" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "stderr" TEXT NOT NULL,
    "expectedOutput" TEXT NOT NULL,
    "error" TEXT NOT NULL,
    "testCasesPassed" INTEGER NOT NULL,
    "totalTestCases" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "runtime" DOUBLE PRECISION NOT NULL,
    "memoryUsed" DOUBLE PRECISION NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobResults_pkey" PRIMARY KEY ("jobId")
);
