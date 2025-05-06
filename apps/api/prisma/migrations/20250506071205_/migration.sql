/*
  Warnings:

  - You are about to drop the column `questionNumber` on the `Problem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[problemNumber]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Problem_questionNumber_key";

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "questionNumber",
ADD COLUMN     "problemNumber" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Problem_problemNumber_key" ON "Problem"("problemNumber");
