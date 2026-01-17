import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'

// Create the database client
const client =
  process.env.NODE_ENV === 'production' && process.env.TURSO_DATABASE_URL
    ? createClient({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
      })
    : createClient({
        url: 'file:./sqlite.db',
      })

// Create and export the Drizzle database instance
export const db = drizzle(client, { schema })
