import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schemas',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'sqlite.db',
  },
});
