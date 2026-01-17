import type { Config } from 'drizzle-kit'

const isProduction = !!process.env.TURSO_DATABASE_URL

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: isProduction ? 'turso' : 'sqlite',
  dbCredentials: isProduction
    ? {
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }
    : {
        url: 'file:./sqlite.db',
      },
} satisfies Config
