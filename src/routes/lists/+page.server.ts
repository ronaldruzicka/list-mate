import { db } from '$lib/db';
import { list } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user?.id;

	// Get all lists for the current user (works for both anonymous and regular users)
	const userLists = userId ? await db.select().from(list).where(eq(list.userId, userId)) : [];

	return { lists: userLists };
};
