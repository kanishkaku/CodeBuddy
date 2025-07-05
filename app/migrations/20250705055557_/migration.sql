/*
  Warnings:

  - You are about to drop the `ContactFormMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DailyStats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PageViewSource` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ContactFormMessage" DROP CONSTRAINT "ContactFormMessage_userId_fkey";

-- DropForeignKey
ALTER TABLE "PageViewSource" DROP CONSTRAINT "PageViewSource_dailyStatsId_fkey";

-- DropTable
DROP TABLE "ContactFormMessage";

-- DropTable
DROP TABLE "DailyStats";

-- DropTable
DROP TABLE "Logs";

-- DropTable
DROP TABLE "PageViewSource";
