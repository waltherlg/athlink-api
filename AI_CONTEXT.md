# Athlink API / Frontend Handoff Context

Updated: 2026-05-07
Workspace: `C:\Users\user\Desktop\prod\athlink-api`

## Project Shape

- Monorepo with `apps/backend`, `apps/frontend`, `packages/shared-types`.
- Backend: NestJS + CQRS + Prisma.
- Frontend: React + Vite, strict TypeScript.
- Shared API paths/types are exported from `packages/shared-types/src/index.ts`.
- Prisma schema is at `apps/backend/src/core/database/prisma/schema.prisma`.

## Recent User Request

Implemented the coach / journal access / coach dashboard flow:

1. Rename frontend usage from `trainingJournalId` to `journalId`.
2. Add coach profile UI and mode switch.
3. Add journal access request creation from a journal page.
4. Add incoming request list + count badge + accept/reject.
5. Add coach dashboard and coach-safe journal records without `privateNotes`.

## Important Shared Types / Paths

Files changed in `packages/shared-types/src`:

- `paths.ts`
  - `trainingJournalsPaths.byId` is now `:journalId`.
  - Added `trainingJournalsPaths.coachRecords`.
  - Added `coachesPaths.profiles`, `availableSportTypes`, `search`.
  - Added `journalAccessPaths`.
- `coaches-api-types.ts`
  - Added `CoachProfileView`, `CoachProfileSearchView`.
- `journal-access-api-types.ts`
  - Added access request input/view/status/count types.
- `dashboards-api-types.ts`
  - Added `CoachDashboardDataView`, `CoachDashboardJournalView`.
- `training-records-api-types.ts`
  - `TrainingRecordCoachView` uses `journalId` and intentionally has no `privateNotes`.
- `error-codes.ts`
  - Added journal access errors: request exists, journal not found, coach profile not found, sport type mismatch.

## Backend Flow Added

### Coaches

Main files:

- `apps/backend/src/features/coaches/api/coaches.controller.ts`
- `apps/backend/src/features/coaches/infrastructure/coaches.repository.ts`

Endpoints:

- `GET /coaches/profiles` returns current user's coach profiles.
- `GET /coaches/available-sport-types` returns sport types not yet used for coach profile.
- `GET /coaches/search?sportType=...&userName=...` searches coach profiles by userName and sport type, excluding current user.
- `POST /coaches` existed already, still creates coach profile.

### Journal Access

Main files:

- `apps/backend/src/features/journal-access/api/journal-access.controller.ts`
- `apps/backend/src/features/journal-access/application/use-cases/create-access-request.use-case.ts`
- `apps/backend/src/features/journal-access/application/use-cases/accept-access-request.use-case.ts`
- `apps/backend/src/features/journal-access/application/use-cases/reject-access-request.use-case.ts`
- `apps/backend/src/features/journal-access/application/query-handlers/get-incoming-access-requests.query-handler.ts`
- `apps/backend/src/features/journal-access/application/query-handlers/count-incoming-access-requests.query-handler.ts`
- `apps/backend/src/features/journal-access/infrastructure/training-journal-access.repository.ts`

Endpoints:

- `POST /journal-access/requests`
  - body: `{ journalId, coachProfileId }`
  - validates journal owner, matching sport type, no existing access, no pending duplicate.
- `GET /journal-access/requests/incoming`
  - current coach user sees pending requests for their coach profiles.
  - returns athlete userName and sport type.
- `GET /journal-access/requests/incoming/count`
  - returns `{ count }`.
- `POST /journal-access/requests/:requestId/accept`
  - creates `JournalAccess` and marks request accepted.
- `POST /journal-access/requests/:requestId/reject`
  - marks request rejected.

### Coach Dashboard

Main files:

- `apps/backend/src/features/dashboards/api/dashboard.controller.ts`
- `apps/backend/src/features/dashboards/application/query-handlers/get-coach-dashboard.query-handler.ts`
- `apps/backend/src/features/dashboards/dashboard.module.ts`

Endpoint:

- `GET /dashboard/coach?coachProfileId=...&pageNumber=...&pageSize=...`
  - returns paginated journals connected to that coach profile.
  - each item includes athlete userName, sport type, latest record date/event/result.

### Coach-Safe Training Records

Main file:

- `apps/backend/src/features/training-journals/application/query-handlers/get-coach-training-records-by-journal-id.query-handler.ts`
- Registered in `training-journal-queries.provider.ts`.
- Controller method added in `training-journals.controller.ts`.

Endpoint:

- `GET /training-journal/:journalId/coach-records`
  - checks current coach user has access through a coach profile.
  - returns paginated `TrainingRecordCoachView`.
  - Does not return `privateNotes`.

## Frontend Flow Added

### API Clients

New folders/files:

- `apps/frontend/src/api/coaches/*`
- `apps/frontend/src/api/journal-access/*`
- `apps/frontend/src/api/dashboard/get-coach-dashboard.ts`
- `apps/frontend/src/api/training-journals/get-coach-training-records.ts`

Updated:

- `apps/frontend/src/api/training-journals/*` now uses `journalId`.
- `apps/frontend/src/api/dashboard/paths.ts`.

### Routes

Updated in `apps/frontend/src/App.tsx`:

- `/journal/:journalId`
- `/journal/:journalId/new-record`
- `/journal/:journalId/records`
- `/journal/:journalId/records/:recordId`
- `/coach/new`
- `/requests`
- `/coach/journal/:journalId/records`

### Header / Mode

Main files:

- `apps/frontend/src/components/AppHeader.tsx`
- `apps/frontend/src/features/dashboard/dashboard-mode.ts`
- `apps/frontend/src/features/dashboard/use-dashboard-mode.ts`

Behavior:

- Header shows `userName Спортсмен` by default.
- If coach profiles exist, a select appears before the role badge:
  - `Спортсмен`
  - `Тренер <SportType>` for each profile.
- If no profiles exist, button `Стать тренером` links to `/coach/new`.
- `Запросы` link appears between `Главная` and `Выйти`.
- Requests count badge polls `/journal-access/requests/incoming/count` every 30 seconds.

### Pages

New pages:

- `apps/frontend/src/features/coaches/CreateCoachProfilePage.tsx`
  - Same idea as journal creation: choose available sport type.
  - If no sport types are available, says profiles already exist for all sports.
- `apps/frontend/src/features/journal-access/AccessRequestsPage.tsx`
  - Shows incoming pending requests with athlete userName + sport type.
  - Buttons: accept/reject.
- `apps/frontend/src/features/training-journals/CoachTrainingRecordsPage.tsx`
  - Shows coach-safe records with no private notes.

Updated pages:

- `DashboardPage.tsx`
  - Uses athlete dashboard in athlete mode.
  - Uses `/dashboard/coach` in coach mode with selected `coachProfileId`.
- `TrainingJournalPage.tsx`
  - Added `Добавить тренера`.
  - Searches only coach profiles with the same journal sport type.
  - User chooses username, confirms, sends access request.
- `CreateTrainingRecordPage.tsx`, `TrainingRecordsPage.tsx`, `TrainingRecordPage.tsx`
  - Switched URL param/code from `trainingJournalId` to `journalId`.

## Validation Already Run

These commands passed:

```bash
pnpm --filter @shared-types build
pnpm -C apps/backend build
pnpm -C apps/frontend build
```

Note: frontend build may need approval/outside sandbox because Vite/esbuild can fail with `spawn EPERM` inside the sandbox.

## Known Git / Workspace Notes

- Git may complain about dubious ownership. Use:

```bash
git -c safe.directory=C:/Users/user/Desktop/prod/athlink-api status --short
```

- `apps/frontend/tsconfig.tsbuildinfo` changed because frontend build was run.
- `fixnotes.md` was already changed by the user's IDE/context and should not be treated as code.
- Do not revert unrelated dirty files unless the user explicitly asks.

## Next Useful Checks

- Run the app manually and test:
  - create coach profile;
  - athlete sends access request from a journal;
  - coach sees count badge and incoming request;
  - coach accepts;
  - coach switches dashboard mode and opens athlete journal records;
  - confirm `privateNotes` is absent in coach record responses.

## Style / Architecture Reminders

- Keep backend logic in use-cases/query-handlers; repositories only query/persist.
- Use `@shared-types` in controllers/API clients.
- For new paginated endpoints use `PaginationOutputModel<T>` and `RequestQueryParamsModel`.
- Do not add `privateNotes` to any coach-facing view.

## 2026-05-07 Follow-Up Fixes

Implemented additional coach dashboard / coach journal / access revocation changes.

Shared types and paths:

- `CoachDashboardJournalView.latestRecord` now includes `coachNotes`.
- `TrainingRecordCoachView` now includes `event` and still does not include `privateNotes`.
- Added `CoachTrainingRecordsPaginationView`, which includes `athleteUserName`.
- Added `JournalCoachAccessView`.
- Added `trainingJournalsPaths.coachRecordById`.
- Added `journalAccessPaths.journalCoaches` and `journalAccessPaths.accessById`.

Backend:

- `GET /training-journal/:journalId/coach-records`
  - now returns `athleteUserName` and record event names.
- `GET /training-journal/:journalId/coach-records/:recordId`
  - added coach-safe single record endpoint.
  - checks coach access and never returns `privateNotes`.
- `GET /dashboard/coach`
  - latest record now includes `coachNotes`.
- `GET /journal-access/journals/:journalId/coaches`
  - athlete owner sees coaches with access to this journal.
  - implemented through `GetJournalCoachAccessesQueryHandler`.
- `DELETE /journal-access/accesses/:accessId`
  - athlete owner revokes a coach access.
  - implemented through `DeleteJournalAccessUseCase`.
  - verifies ownership of the journal behind the access before deletion.

Frontend:

- Coach dashboard rows are compact:
  - one line: `athleteUserName Последняя запись date · event · result`;
  - next line: `coachNotes` preview with ellipsis;
  - actions: `Открыть дневник`, `Открыть последнюю запись`.
- Coach journal records page title is now `Дневник <athleteUserName>`.
- Coach journal records rows are compact:
  - one line: date, event, result;
  - next line: `coachNotes` preview with ellipsis;
  - action: `Открыть запись`.
- Added `/coach/journal/:journalId/records/:recordId`.
- Added `CoachTrainingRecordPage` with `Назад к дневнику`.
- Added `Просмотр тренеров` button on athlete journal page.
- Added `/journal/:journalId/coaches`.
- Added `JournalCoachesPage`:
  - lists coaches with access;
  - `Отменить доступ` asks browser confirmation:
    `Вы уверены что хотите отменить доступ тренера userName к вашему дневнику SportType?`;
  - on confirmation calls `DELETE /journal-access/accesses/:accessId`.

Validation run after these changes:

```bash
pnpm --filter @shared-types build
pnpm -C apps/backend build
pnpm -C apps/frontend build
```

Frontend build still may require approval/outside sandbox because Vite/esbuild can fail with `spawn EPERM` inside the sandbox.
