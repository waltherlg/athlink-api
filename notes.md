### generate migration WITHOUT deploy

не пашет npx dotenv -e .development.local.env -- pnpm prisma migrate dev --create-only --name user-created --schema=src/core/database/prisma/schema.prisma

npx cross-env NODE_ENV=development dotenv -e .development.local.env -- prisma migrate dev --create-only --name user-created

npx cross-env NODE_ENV=development dotenv -e .development.local.env -- pnpm prisma migrate deploy

### ai scripts

### rewrite

.\scripts\ai_snapshot_light.ps1 -OutFile AI_CONTEXT.md

### quick (default file)

.\scripts\ai_snapshot_light.ps1 -Auto
.\scripts\ai_snapshot_light.ps1 -Quick

### when to run

В начале сессии. При крупных изменениях. Перед завершением — по желанию.

### onli terminal

.\scripts\ai_snapshot_light.ps1

### add to context

.\scripts\ai_snapshot_light.ps1 | Add-Content -Path AI_CONTEXT.md
