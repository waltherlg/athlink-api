# AI Changelog

## 2026-08-26

- Added a browser push notification layer for the frontend using Notification API + service worker.
  Files: `apps/frontend/src/notifications/notification-service.ts`, `apps/frontend/src/notifications/use-push-notifications.ts`, `apps/frontend/src/notifications/notification-messages.ts`, `apps/frontend/public/athlink-sw.js`, `apps/frontend/src/main.tsx`
- Centralized notification texts and tags to avoid duplication across the UI.
  Files: `apps/frontend/src/notifications/notification-messages.ts`
- Added notification triggers for:
  - athlete after a journal access request is created;
  - coach when request count increases;
  - coach when a request is accepted;
  - athlete when a coach accepts access to their journal;
  - coach when a new training record is created in a connected journal.
    Files: `apps/frontend/src/features/training-journals/TrainingJournalPage.tsx`, `apps/frontend/src/components/AppHeader.tsx`, `apps/frontend/src/features/journal-access/AccessRequestsPage.tsx`, `apps/frontend/src/features/journal-access/JournalCoachesPage.tsx`, `apps/frontend/src/features/dashboard/DashboardPage.tsx`
- Kept a future-ready design for true server push (VAPID/Firebase) by encapsulating notification logic in a reusable hook.

## 2026-03-11

- Added AI_CONTEXT.md to document architecture and conventions inferred from src; created file to guide AI-assisted development.
  Files: AI_CONTEXT.md
- Restructured into a pnpm monorepo with `apps/backend` and `apps/frontend`; moved backend sources/configs, added Vite React frontend scaffold, and added workspace config to keep backend scripts working from root.
  Files: package.json, pnpm-workspace.yaml, apps/backend/_, apps/frontend/_, AI_CONTEXT.md
