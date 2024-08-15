import pb from '$lib/api/pocketbaseClient';
import { getTickets } from '$lib/api/tickets';

export async function load({ url, fetch }) {
	pb.beforeSend = function (url, options) {
		options.fetch = fetch;
		return { url, options };
	};

	return {
		tickets: (await getTickets({})) ?? []
	};
}
