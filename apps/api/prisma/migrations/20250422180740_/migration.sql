/*
  Warnings:

  - You are about to drop the column `memory` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Submission` table. All the data in the column will be lost.
  - Added the required column `totalTestCases` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "memory",
DROP COLUMN "score",
ADD COLUMN     "memoryUsed" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "testCasesPassed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalTestCases" INTEGER NOT NULL;
