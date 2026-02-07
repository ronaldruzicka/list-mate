import { db } from '$lib/db';
import { list } from '$lib/db/schema';
import { createListSchema } from '$lib/schemas';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { RequestEvent } from './$types';

export const load = async () => {
	const form = await superValidate(zod4(createListSchema));
	return { form };
};

export const actions = {
	create: async ({ request }: RequestEvent) => {
		const form = await superValidate(request, zod4(createListSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const [insertedList] = await db
			.insert(list)
			.values({
				id: crypto.randomUUID(),
				name: form.data.name,
				userId: null,
			})
			.returning();

		throw redirect(303, `/lists/${insertedList.id}`);
	},
};
