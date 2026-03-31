-- CreateEnum
CREATE TYPE "AccessRole" AS ENUM ('COACH');

-- CreateEnum
CREATE TYPE "SportType" AS ENUM ('SHOOTING');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingJournal" (
    "id" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "sportType" "SportType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingJournal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,
    "role" "AccessRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coachAthleteId" TEXT,

    CONSTRAINT "JournalAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingRecord" (
    "id" TEXT NOT NULL,
    "trainingJournalId" TEXT NOT NULL,
    "result" TEXT,
    "coachNotes" TEXT,
    "privateNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingJournal_sportType_key" ON "TrainingJournal"("sportType");

-- CreateIndex
CREATE UNIQUE INDEX "JournalAccess_userId_journalId_key" ON "JournalAccess"("userId", "journalId");

-- AddForeignKey
ALTER TABLE "TrainingJournal" ADD CONSTRAINT "TrainingJournal_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalAccess" ADD CONSTRAINT "JournalAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalAccess" ADD CONSTRAINT "JournalAccess_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "TrainingJournal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingRecord" ADD CONSTRAINT "TrainingRecord_trainingJournalId_fkey" FOREIGN KEY ("trainingJournalId") REFERENCES "TrainingJournal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
