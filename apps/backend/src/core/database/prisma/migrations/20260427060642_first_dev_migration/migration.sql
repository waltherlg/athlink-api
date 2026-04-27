-- CreateEnum
CREATE TYPE "AccessRole" AS ENUM ('COACH');

-- CreateEnum
CREATE TYPE "SportType" AS ENUM ('SHOOTING_RIFLE_PISTOL');

-- CreateEnum
CREATE TYPE "ResultType" AS ENUM ('SCORE', 'TIME', 'DISTANCE');

-- CreateEnum
CREATE TYPE "TrainingRecordType" AS ENUM ('STRUCTURED', 'FREE');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "userName" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "confirmationCode" UUID,
    "confirmCodeExpiryDate" TIMESTAMP(3),
    "passwordRecoveryCode" UUID,
    "passwordRecoveryExpiresAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingJournal" (
    "id" UUID NOT NULL,
    "athleteId" UUID NOT NULL,
    "sportType" "SportType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingJournal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalAccess" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "journalId" UUID NOT NULL,
    "role" "AccessRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coachAthleteId" TEXT,

    CONSTRAINT "JournalAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingRecord" (
    "id" UUID NOT NULL,
    "trainingJournalId" UUID NOT NULL,
    "type" "TrainingRecordType" NOT NULL,
    "eventId" UUID,
    "result" DOUBLE PRECISION,
    "coachNotes" TEXT,
    "privateNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SportEvent" (
    "id" UUID NOT NULL,
    "sportType" "SportType" NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "resultType" "ResultType" NOT NULL,
    "maxScore" DOUBLE PRECISION,
    "decimals" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SportEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingJournal_athleteId_sportType_key" ON "TrainingJournal"("athleteId", "sportType");

-- CreateIndex
CREATE UNIQUE INDEX "JournalAccess_userId_journalId_key" ON "JournalAccess"("userId", "journalId");

-- CreateIndex
CREATE UNIQUE INDEX "SportEvent_sportType_code_key" ON "SportEvent"("sportType", "code");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingJournal" ADD CONSTRAINT "TrainingJournal_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalAccess" ADD CONSTRAINT "JournalAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalAccess" ADD CONSTRAINT "JournalAccess_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "TrainingJournal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingRecord" ADD CONSTRAINT "TrainingRecord_trainingJournalId_fkey" FOREIGN KEY ("trainingJournalId") REFERENCES "TrainingJournal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingRecord" ADD CONSTRAINT "TrainingRecord_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "SportEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
