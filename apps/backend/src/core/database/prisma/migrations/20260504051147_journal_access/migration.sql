/*
  Warnings:

  - You are about to drop the column `coachAthleteId` on the `JournalAccess` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `JournalAccess` table. All the data in the column will be lost.
  - You are about to drop the column `trainingJournalId` on the `TrainingRecord` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[coachProfileId,journalId]` on the table `JournalAccess` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `coachProfileId` to the `JournalAccess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `journalId` to the `TrainingRecord` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "JournalAccess" DROP CONSTRAINT "JournalAccess_userId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingRecord" DROP CONSTRAINT "TrainingRecord_trainingJournalId_fkey";

-- DropIndex
DROP INDEX "JournalAccess_userId_journalId_key";

-- AlterTable
ALTER TABLE "JournalAccess" DROP COLUMN "coachAthleteId",
DROP COLUMN "userId",
ADD COLUMN     "coachProfileId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "TrainingRecord" DROP COLUMN "trainingJournalId",
ADD COLUMN     "journalId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "CoachProfile" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "sportType" "SportType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoachProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessRequest" (
    "id" UUID NOT NULL,
    "journalId" UUID NOT NULL,
    "coachProfileId" UUID NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "AccessRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CoachProfile_userId_sportType_key" ON "CoachProfile"("userId", "sportType");

-- CreateIndex
CREATE UNIQUE INDEX "JournalAccess_coachProfileId_journalId_key" ON "JournalAccess"("coachProfileId", "journalId");

-- AddForeignKey
ALTER TABLE "JournalAccess" ADD CONSTRAINT "JournalAccess_coachProfileId_fkey" FOREIGN KEY ("coachProfileId") REFERENCES "CoachProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingRecord" ADD CONSTRAINT "TrainingRecord_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "TrainingJournal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachProfile" ADD CONSTRAINT "CoachProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessRequest" ADD CONSTRAINT "AccessRequest_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "TrainingJournal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessRequest" ADD CONSTRAINT "AccessRequest_coachProfileId_fkey" FOREIGN KEY ("coachProfileId") REFERENCES "CoachProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
