import pb from '$lib/api/pocketbaseClient';
import { currentUser } from '$lib/stores/auth';
import { redirect } from '@sveltejs/kit';

import { getRecipientList } from '$lib/api/recipients';

export async function load({ url, fetch }) {
	pb.beforeSend = function (url, options) {
		options.fetch = fetch;
		return { url, options };
	};

	if (!pb.authStore.isValid) {
		currentUser.set(null);
		redirect(307, '/login');
	}

	try {
		const results = await Promise.allSettled([getRecipientList()]);

		const [recipients] = results.map((result) =>
			result.status === 'fulfilled' ? result.value : []
		);

		recipients.sort((a, b) => {
			if (a.type === 'CC' && b.type !== 'CC') return -1;
			if (a.type !== 'CC' && b.type === 'CC') return 1;
			return 0;
		});

		return {
			recipients
		};
	} catch (error) {
		console.error(error);
		return [];
	}
}
