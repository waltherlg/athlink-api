-- CreateEnum
CREATE TYPE "SportType" AS ENUM ('SHOOTING');

-- CreateTable
CREATE TABLE "CoachAthlete" (
    "id" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoachAthlete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingLog" (
    "id" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "sportType" "SportType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entry" (
    "id" TEXT NOT NULL,
    "trainingLogId" TEXT NOT NULL,
    "result" TEXT,
    "coachNotes" TEXT,
    "privateNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CoachAthlete_coachId_athleteId_key" ON "CoachAthlete"("coachId", "athleteId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingLog_sportType_key" ON "TrainingLog"("sportType");

-- AddForeignKey
ALTER TABLE "CoachAthlete" ADD CONSTRAINT "CoachAthlete_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachAthlete" ADD CONSTRAINT "CoachAthlete_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingLog" ADD CONSTRAINT "TrainingLog_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_trainingLogId_fkey" FOREIGN KEY ("trainingLogId") REFERENCES "TrainingLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
