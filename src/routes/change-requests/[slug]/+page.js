import pb from '$lib/api/pocketbaseClient';
import { getRequestById } from '$lib/api/changeRequests';
import { getMembersByChangeTeamId } from '$lib/api/changeTeams';
import { urlToFile } from '$lib/utils/parsers';

export async function load({ params, url, fetch }) {
	pb.beforeSend = function (url, options) {
		options.fetch = fetch;
		return { url, options };
	};

	const request = (await getRequestById(params.slug)) ?? [];
	const fileToken = await pb.files.getToken();
	const attachmentUrl = pb.files.getUrl(request, request.attachment, {
		token: fileToken
	});

	return {
		request,
		attachmentUrl,
		attachment: (await urlToFile(attachmentUrl, fetch)) ?? [],
		members: (await getMembersByChangeTeamId(request.changeTeamId)) ?? []
	};
}
