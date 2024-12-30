import pb from '$lib/api/pocketbaseClient';
import { currentUser } from '$lib/stores/auth';
import { redirect } from '@sveltejs/kit';

import { getTickets } from '$lib/api/tickets';
import { getRecentHistory } from '$lib/api/history';
import { getVerifiedCCEmailRecipient } from '$lib/api/recipients';

export async function load({ url, fetch }) {
	pb.beforeSend = function (url, options) {
		options.fetch = fetch;
		return { url, options };
	};

	if (!pb.authStore.isValid) {
		currentUser.set(null);
		redirect(307, '/login');
	}

	const filters = {
		page: url.searchParams.get('page') ?? 1,
		perPage: url.searchParams.get('perPage') ?? 20,
		title: url.searchParams.get('title') ?? '',
		description: url.searchParams.get('description') ?? '',
		categoryId: url.searchParams.get('categoryId') ?? '',
		categoryLevelId: url.searchParams.get('categoryLevelId') ?? '',
		regionId: url.searchParams.get('regionId') ?? '',
		siteId: url.searchParams.get('siteId') ?? '',
		areaId: url.searchParams.get('areaId') ?? '',
		faultTypeId: url.searchParams.get('faultTypeId') ?? '',
		cause: url.searchParams.get('cause') ?? '',
		solution: url.searchParams.get('solution') ?? '',
		ticketNumber: url.searchParams.get('ticketNumber') ?? '',
		teamIds: url.searchParams.get('teamIds') ?? '',
		departmentIds: url.searchParams.get('departmentIds') ?? '',
		status: url.searchParams.get('status') ?? ''
	};

	try {
		await getRecentHistory();

		return {
			filters,
			tickets: await getTickets(filters),
			verifiedCCEmailRecipient: await getVerifiedCCEmailRecipient()
		};
	} catch (error) {
		console.error(error);
		return [];
	}
}
