import type { Handle } from '@sveltejs/kit';

import { building } from '$app/environment';
import { auth } from '$lib/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.user = null;
	event.locals.session = null;

	const session = await auth.api.getSession({
		headers: event.request.headers,
	});

	if (session) {
		event.locals.user = session.user;
		event.locals.session = session.session;
	}

	return svelteKitHandler({
		event,
		resolve,
		auth,
		building,
	});
};
