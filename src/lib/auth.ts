import { getRequestEvent } from '$app/server';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { anonymous } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { eq } from 'drizzle-orm';
import { db } from './db';
import * as schema from './db/schema';
import { list } from './db/schema';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite',
		schema,
	}),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
		sveltekitCookies(getRequestEvent),
		anonymous({
			onLinkAccount: async ({ anonymousUser, newUser }) => {
				// Transfer lists from anonymous user to the new user
				await db
					.update(list)
					.set({ userId: newUser.user.id })
					.where(eq(list.userId, anonymousUser.user.id));
			},
		}),
	],
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 60 * 5, // 5 minutes
		},
	},
});
