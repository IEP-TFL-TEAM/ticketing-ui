import pb from '$lib/api/pocketbaseClient';
import { getTicketById } from '$lib/api/tickets';
import { getCommentsByTicketId } from '$lib/api/comments';
import { getHistoryByTicketId } from '$lib/api/history';
import { getSiteById } from '$lib/api/sites';
import { urlToFile } from '$lib/utils/parsers';

export async function load({ params, url, fetch }) {
	pb.beforeSend = function (url, options) {
		options.fetch = fetch;
		return { url, options };
	};

	try {
		const ticketId = params.slug;
		await getHistoryByTicketId(ticketId);
		const fileToken = await pb.files.getToken();

		const ticket = (await getTicketById(ticketId)) ?? [];
		const attachmentUrl = pb.files.getUrl(ticket, ticket.attachment, {
			token: fileToken
		});

		const comments = (await getCommentsByTicketId(ticketId)) ?? [];
		const commentAttachmentUrls = comments.map((comment) =>
			pb.files.getUrl(comment, comment.attachment, {
				token: fileToken
			})
		);

		const results = await Promise.allSettled([
			getSiteById(ticket.siteId),
			urlToFile(attachmentUrl, fetch),
			getUrlsToFile(commentAttachmentUrls, fetch)
		]);

		const [site, attachment, commentAttachments] = results.map(({ status, value }) =>
			status === 'fulfilled' ? value : []
		);

		return {
			ticket,
			comments,
			commentAttachmentUrls,
			commentAttachments,
			attachmentUrl,
			attachment,
			site
		};
	} catch (error) {
		console.error(error);
		return [];
	}
}

async function getUrlsToFile(attachmentUrls, fetch) {
	let commentFiles = [];

	for (const fileUrl of attachmentUrls) {
		if (fileUrl) {
			try {
				const file = await urlToFile(fileUrl, fetch);
				commentFiles.push(file || createEmptyFile());
			} catch (error) {
				console.error('Error converting URL to file:', error);
				commentFiles.push(createEmptyFile());
			}
		} else {
			commentFiles.push(createEmptyFile());
		}
	}

	return commentFiles;
}

function createEmptyFile() {
	return {
		name: 'No Attachment',
		type: 'empty',
		size: 0,
		content: null
	};
}
