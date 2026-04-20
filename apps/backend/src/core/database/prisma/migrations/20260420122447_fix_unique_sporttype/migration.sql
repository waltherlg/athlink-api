/*
  Warnings:

  - A unique constraint covering the columns `[athleteId,sportType]` on the table `TrainingJournal` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TrainingJournal_sportType_key";

-- CreateIndex
CREATE UNIQUE INDEX "TrainingJournal_athleteId_sportType_key" ON "TrainingJournal"("athleteId", "sportType");
