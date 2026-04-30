-- This is an empty migration.
CREATE UNIQUE INDEX unique_pending_request
ON "CoachAccessRequest" ("journalId", "coachProfileId")
WHERE status = 'PENDING';