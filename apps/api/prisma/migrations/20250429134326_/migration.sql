/*
  Warnings:

  - A unique constraint covering the columns `[userId,contestId]` on the table `ContestParticipation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contestId,problemId]` on the table `ContestProblem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TestCase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TestCase" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ContestParticipation_userId_contestId_key" ON "ContestParticipation"("userId", "contestId");

-- CreateIndex
CREATE UNIQUE INDEX "ContestProblem_contestId_problemId_key" ON "ContestProblem"("contestId", "problemId");
