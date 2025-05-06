/*
  Warnings:

  - A unique constraint covering the columns `[questionNumber]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "questionNumber" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Problem_questionNumber_key" ON "Problem"("questionNumber");
