import pb from '$lib/api/pocketbaseClient';
import { getTicketById } from '$lib/api/tickets';
import { getTeams } from '$lib/api/teams';
import { getCommentsByTicketId } from '$lib/api/comments';

export async function load({ params, url, fetch }) {
	pb.beforeSend = function (url, options) {
		options.fetch = fetch;
		return { url, options };
	};

	const ticketId = params.slug;

	return {
		ticket: await getTicketById(ticketId),
		teams: await getTeams(),
		comments: await getCommentsByTicketId(ticketId)
	};
}
