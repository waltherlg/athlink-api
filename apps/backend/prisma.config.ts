import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './src/core/database/prisma/schema.prisma',

  migrations: {
    path: './src/core/database/prisma/migrations',
    seed: 'ts-node src/core/database/prisma/seed.ts',
  },

  datasource: {
    url: 'postgresql://placeholder',
  },
});
