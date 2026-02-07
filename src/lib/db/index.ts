import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

const databaseUrl = env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error('DATABASE_URL environment variable is not set');
}

const sqlite = new Database(databaseUrl);
export const db = drizzle(sqlite, { schema });
