import pb from '$lib/api/pocketbaseClient';
import { getRequestById } from '$lib/api/changeRequests';
import { urlToFile } from '$lib/utils/parsers';

export async function load({ params, url, fetch }) {
	pb.beforeSend = function (url, options) {
		options.fetch = fetch;
		return { url, options };
	};

	try {
		const results = await Promise.allSettled([pb.files.getToken(), getRequestById(params.slug)]);

		const [fileToken, request] = results.map(({ status, value }) =>
			status === 'fulfilled' ? value : []
		);

		const attachmentUrl = pb.files.getUrl(request, request.attachment, {
			token: fileToken
		});

		const closingAttachmentUrl = pb.files.getUrl(request, request?.closingAttachment, {
			token: fileToken
		});

		return {
			request,
			attachmentUrl,
			closingAttachmentUrl,
			attachment: (await urlToFile(attachmentUrl, fetch)) ?? [],
			closingAttachment: (await urlToFile(closingAttachmentUrl, fetch)) ?? []
		};
	} catch (error) {
		console.error(error);
		return [];
	}
}
