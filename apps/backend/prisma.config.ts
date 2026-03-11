import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './src/core/database/prisma/schema.prisma',

  migrations: {
    path: './src/core/database/prisma/migrations',
  },

  datasource: {
    url: process.env.DATABASE_URL,
  },
});
