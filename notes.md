### generate migration WITHOUT deploy

не пашет npx dotenv -e .development.local.env -- pnpm prisma migrate dev --create-only --name user-created --schema=src/core/database/prisma/schema.prisma

npx cross-env NODE_ENV=development dotenv -e .development.local.env -- prisma migrate dev --create-only --name user-created

npx cross-env NODE_ENV=development dotenv -e .development.local.env -- pnpm prisma migrate deploy

### ai scripts

### rewrite

.\scripts\ai_snapshot_light.ps1 -OutFile AI_CONTEXT.md

### onli terminal

.\scripts\ai_snapshot_light.ps1

### add to context

.\scripts\ai_snapshot_light.ps1 | Add-Content -Path AI_CONTEXT.md
