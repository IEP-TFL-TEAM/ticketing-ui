import { getTickets } from '$lib/api/tickets';
import pb from '$lib/api/pocketbaseClient';

export async function load({ url, fetch }) {
	pb.beforeSend = function (url, options) {
		options.fetch = fetch;
		return { url, options };
	};

	const filters = {
		page: url.searchParams.get('page') ?? 1,
		perPage: url.searchParams.get('perPage') ?? 20,
		title: url.searchParams.get('title'),
		description: url.searchParams.get('description'),
		count: url.searchParams.get('count'),
		status: url.searchParams.get('status'),
		severity: url.searchParams.get('severity')
	};

	return {
		filters,
		tickets: await getTickets(filters)
	};
}
