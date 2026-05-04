CREATE UNIQUE INDEX "unique_pending_request"
ON "AccessRequest" ("journalId", "coachProfileId")
WHERE status = 'PENDING';