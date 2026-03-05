### generate migration WITHOUT deploy

npx dotenv -e .development.local.env -- pnpm prisma migrate dev --create-only --name user-created --schema=src/core/database/prisma/schema.prisma
