import pb from '$lib/api/pocketbaseClient';
import { currentUser } from '$lib/stores/auth';
import { redirect } from '@sveltejs/kit';
import { getAllTickets } from '$lib/api/tickets';
import { getCategories } from '$lib/api/categories';
import { getAllRequests } from '$lib/api/changeRequests';
import { getAllRoutines } from '$lib/api/routineMaintenance';

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
		const results = await Promise.allSettled([
			getCategories(),
			getAllTickets(),
			getAllRequests(),
			getAllRoutines()
		]);

		const [categories, tickets, requests, routines] = results.map((result) =>
			result.status === 'fulfilled' ? result.value : []
		);

		return {
			categories,
			tickets,
			requests,
			routines
		};
	} catch (error) {
		console.error(error);
		return [];
	}
}
