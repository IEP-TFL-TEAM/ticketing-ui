import pb from '$lib/api/pocketbaseClient';
import { getAllTickets } from '$lib/api/tickets';
import { getCategories } from '$lib/api/categories';
import { getAllRequests } from '$lib/api/changeRequests';
import { getAllRoutines } from '$lib/api/routineMaintenance';

export async function load({ url, fetch }) {
	pb.beforeSend = function (url, options) {
		options.fetch = fetch;
		return { url, options };
	};

	return {
		tickets: (await getAllTickets()) ?? [],
		categories: (await getCategories()) ?? [],
		requests: (await getAllRequests()) ?? [],
		routine: (await getAllRoutines()) ?? []
	};
}
