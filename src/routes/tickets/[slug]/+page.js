import pb from '$lib/api/pocketbaseClient';
import { getTicketById } from '$lib/api/tickets';
import { getTeams } from '$lib/api/teams';
import { getCommentsByTicketId } from '$lib/api/comments';
import { getHistoryByTicketId } from '$lib/api/history';
import { getSolutionCodes } from '$lib/api/solutionCodes';
import { getSiteById } from '$lib/api/sites';
import { getOfficeLocations } from '$lib/api/officeLocations';
import { urlToFile } from '$lib/utils/parsers';

export async function load({ params, url, fetch }) {
	pb.beforeSend = function (url, options) {
		options.fetch = fetch;
		return { url, options };
	};

	const ticketId = params.slug;
	await getHistoryByTicketId(ticketId);

	const ticket = (await getTicketById(ticketId)) ?? [];
	const fileToken = await pb.files.getToken();

	const attachmentUrl = pb.files.getUrl(ticket, ticket.attachment, {
		token: fileToken
	});

	return {
		ticket,
		teams: (await getTeams()) ?? [],
		comments: (await getCommentsByTicketId(ticketId)) ?? [],
		attachmentUrl,
		attachment: (await urlToFile(attachmentUrl, fetch)) ?? [],
		solutionCodes: (await getSolutionCodes()) ?? [],
		site: (await getSiteById(ticket.siteId)) ?? [],
		officeLocations: (await getOfficeLocations()) ?? []
	};
}
