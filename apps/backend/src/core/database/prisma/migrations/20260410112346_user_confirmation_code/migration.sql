-- DropForeignKey
ALTER TABLE "JournalAccess" DROP CONSTRAINT "JournalAccess_journalId_fkey";

-- DropForeignKey
ALTER TABLE "JournalAccess" DROP CONSTRAINT "JournalAccess_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingJournal" DROP CONSTRAINT "TrainingJournal_athleteId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingRecord" DROP CONSTRAINT "TrainingRecord_trainingJournalId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordRecoveryCode" UUID,
ADD COLUMN     "passwordRecoveryExpiresAt" TIMESTAMP(3);

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
