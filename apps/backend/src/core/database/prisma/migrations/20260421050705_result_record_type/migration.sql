/*
  Warnings:

  - The `result` column on the `TrainingRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `type` to the `TrainingRecord` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ResultType" AS ENUM ('SCORE', 'TIME', 'DISTANCE');

-- CreateEnum
CREATE TYPE "TrainingRecordType" AS ENUM ('STRUCTURED', 'FREE');

-- AlterTable
ALTER TABLE "TrainingRecord" ADD COLUMN     "eventId" UUID,
ADD COLUMN     "type" "TrainingRecordType" NOT NULL,
DROP COLUMN "result",
ADD COLUMN     "result" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Event" (
    "id" UUID NOT NULL,
    "sportType" "SportType" NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "resultType" "ResultType" NOT NULL,
    "maxScore" DOUBLE PRECISION,
    "decimals" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_sportType_code_key" ON "Event"("sportType", "code");

-- AddForeignKey
ALTER TABLE "TrainingRecord" ADD CONSTRAINT "TrainingRecord_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
