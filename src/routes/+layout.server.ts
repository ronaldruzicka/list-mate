import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (locals.session && (url.pathname === '/' || url.pathname === '/auth')) {
		redirect(302, '/lists');
	}

	return {
		session: locals.session,
		user: locals.user,
	};
};
