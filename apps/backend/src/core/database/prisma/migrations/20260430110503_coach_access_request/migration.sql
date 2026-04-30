/*
  Warnings:

  - You are about to drop the column `coachAthleteId` on the `JournalAccess` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "JournalAccess" DROP COLUMN "coachAthleteId";

-- CreateTable
CREATE TABLE "CoachProfile" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "sportType" "SportType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoachProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoachAccessRequest" (
    "id" UUID NOT NULL,
    "journalId" UUID NOT NULL,
    "coachProfileId" UUID NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "CoachAccessRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CoachProfile_userId_sportType_key" ON "CoachProfile"("userId", "sportType");

-- AddForeignKey
ALTER TABLE "CoachProfile" ADD CONSTRAINT "CoachProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachAccessRequest" ADD CONSTRAINT "CoachAccessRequest_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "TrainingJournal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachAccessRequest" ADD CONSTRAINT "CoachAccessRequest_coachProfileId_fkey" FOREIGN KEY ("coachProfileId") REFERENCES "CoachProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
