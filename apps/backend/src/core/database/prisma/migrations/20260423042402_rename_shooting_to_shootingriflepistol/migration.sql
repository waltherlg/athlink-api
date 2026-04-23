/*
  Warnings:

  - The values [SHOOTING] on the enum `SportType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SportType_new" AS ENUM ('SHOOTING_RIFLE_PISTOL');
ALTER TABLE "TrainingJournal" ALTER COLUMN "sportType" TYPE "SportType_new" USING ("sportType"::text::"SportType_new");
ALTER TABLE "Event" ALTER COLUMN "sportType" TYPE "SportType_new" USING ("sportType"::text::"SportType_new");
ALTER TYPE "SportType" RENAME TO "SportType_old";
ALTER TYPE "SportType_new" RENAME TO "SportType";
DROP TYPE "public"."SportType_old";
COMMIT;
