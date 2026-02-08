import { db } from '$lib/db';
import { createListSchema, list } from '$lib/db/schema';
import { fAwait } from '$lib/helpers/fawait';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { RequestEvent } from './$types';

export const load = async () => {
	const form = await superValidate(zod4(createListSchema));
	return { form };
};

export const actions = {
	create: async ({ request, locals }: RequestEvent) => {
		const form = await superValidate(request, zod4(createListSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// Anonymous users will have a null userId; authenticated users will have their ID
		const userId = locals.user?.id ?? null;

		const [error, result] = await fAwait(
			db
				.insert(list)
				.values({
					id: crypto.randomUUID(),
					name: form.data.name,
					userId,
				})
				.returning(),
		);

		if (error) {
			return fail(500, { form, message: 'Failed to create list' });
		}

		const [newList] = result;

		if (!newList) {
			return fail(500, { form, message: 'Failed to create list' });
		}

		redirect(303, `/lists/${newList.id}`);
	},
};
