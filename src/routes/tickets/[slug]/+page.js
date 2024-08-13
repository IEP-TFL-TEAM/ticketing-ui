import pb from '$lib/api/pocketbaseClient';
import { getTicketById } from '$lib/api/tickets';
import { getTeams } from '$lib/api/teams';
import { getCommentsByTicketId } from '$lib/api/comments';
import { getPhotosByTicketId } from '$lib/api/photos';
import { getHistoryByTicketId } from '$lib/api/history';

export async function load({ params, url, fetch }) {
	pb.beforeSend = function (url, options) {
		options.fetch = fetch;
		return { url, options };
	};

	const ticketId = params.slug;
	await getPhotosByTicketId(ticketId);
	await getHistoryByTicketId(ticketId);

	return {
		ticket: await getTicketById(ticketId),
		teams: await getTeams(),
		comments: await getCommentsByTicketId(ticketId)
	};
}
