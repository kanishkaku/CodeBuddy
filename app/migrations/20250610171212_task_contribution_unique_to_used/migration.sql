/*
  Warnings:

  - A unique constraint covering the columns `[userId,issueId]` on the table `TaskContribution` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TaskContribution_userId_issueId_key" ON "TaskContribution"("userId", "issueId");
