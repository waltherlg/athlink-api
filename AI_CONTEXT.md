# AI Context: Athlink API (NestJS)

This document summarizes the architecture and conventions inferred from `src/` only.

## Architecture Overview

The project follows a feature-first, layered NestJS architecture with clear separation of:

- `api` layer for HTTP controllers and request DTOs
- `application` layer for use-cases (CQRS command handlers)
- `infrastructure` layer for repositories and persistence adapters
- `schemas` layer for Zod schemas shared across DTOs and domain-ish validation
- `core` for cross-cutting services (config, database)
- `setup` for application bootstrap and framework configuration

The `@nestjs/cqrs` package is used for use-cases, and Zod with `@anatine/zod-nestjs` is used for DTO validation.

## Folder Purposes (src/)

- `src/core/`
  - Cross-cutting infrastructure and global modules.
  - `core.module.ts` registers configuration globally.
  - `config/` holds environment config and validation.
  - `database/prisma/` contains Prisma schema, module, and service.

- `src/features/`
  - Feature modules grouped by business capability (e.g., `auth`, `users`).
  - Each feature contains its own layers: `api/`, `application/`, `infrastructure/`, `schemas/`.
  - Feature module wires providers/controllers for the feature.

- `src/setup/`
  - App bootstrap configuration and infrastructure setup.
  - `app.setup.ts` composes CORS, cookies, exception filters, swagger, etc.
  - `swagger.setup.ts` defines API docs.
  - `exception-filter.setup.ts` reserved for global filters.
  - `utils/` contains reusable setup utilities (e.g., config validation).

- `src/`
  - Root Nest entry points: `main.ts`, `app.module.ts`, `app.controller.ts`, `app.service.ts`.

## Where Things Live

- Controllers: `src/features/<feature>/api/*.controller.ts`
  - Example: `src/features/auth/api/registration.controller.ts`

- Request DTOs: `src/features/<feature>/api/dto/*.dto.ts`
  - Built from Zod schemas via `createZodDto`.

- Application logic (use-cases): `src/features/<feature>/application/use-cases/*.use-case.ts`
  - CQRS `CommandHandler` + `ICommandHandler` pattern.

- Application DTOs: `src/features/<feature>/application/dto/*.dto.ts`
  - Example: `src/features/users/application/dto/create-user.dto.ts`

- Schemas: `src/features/<feature>/schemas/*.schema.ts`
  - Zod schemas defining shapes for validation and type alignment.
  - These often mirror Prisma models for consistency.

- Repositories: `src/features/<feature>/infrastructure/*.repository.ts`
  - Prisma-backed data access via `PrismaService`.

- Global infrastructure:
  - Config: `src/core/config/`
  - Database: `src/core/database/prisma/`
  - App setup: `src/setup/`

## Naming Conventions

- File names use `kebab-case` with role suffixes:
  - `*.module.ts`, `*.controller.ts`, `*.service.ts`
  - `*.dto.ts`, `*.schema.ts`, `*.repository.ts`
  - `*.use-case.ts`, `*.setup.ts`, `*.consts.ts`
- Folder names are lowercase and descriptive (`features`, `core`, `setup`, `api`, `application`, `infrastructure`, `schemas`).
- DTO classes use `PascalCase` with suffix `Dto`.
- Use-case classes use `PascalCase` with suffix `UseCase`.
- Constants use `UPPER_SNAKE_CASE` inside objects.
- Prisma models are consumed via `@prisma/client` types.

## How To Add A New Feature

Create a new folder under `src/features/<feature>/` and follow the established layering:

1. `api/`
   - Add controller(s) under `api/*.controller.ts`.
   - Add request DTOs under `api/dto/*.dto.ts`.
   - Use Zod schemas and `createZodDto` for validation.

2. `application/`
   - Add use-cases under `application/use-cases/*.use-case.ts`.
   - If needed, define feature-specific application DTOs under `application/dto/`.
   - Use `@nestjs/cqrs` command handlers for business flows.

3. `schemas/`
   - Define Zod schemas for data shapes that align with Prisma models.

4. `infrastructure/`
   - Add repositories under `infrastructure/*.repository.ts` using `PrismaService`.
   - Keep persistence details here; do not embed database logic in controllers.

5. `feature.module.ts`
   - Provide repositories and use-cases.
   - Export providers needed by other features.
   - Register controllers for HTTP endpoints.

6. Wire into `src/app.module.ts`
   - Import the feature module.

This keeps API, application logic, and persistence cleanly separated and consistent with the rest of the codebase.
