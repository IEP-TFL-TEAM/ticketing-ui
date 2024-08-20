import pb from '$lib/api/pocketbaseClient';
import { getRecipientList } from '$lib/api/recipients';

export async function load({ url, fetch }) {
	pb.beforeSend = function (url, options) {
		options.fetch = fetch;
		return { url, options };
	};

	return {
		recipients: (await getRecipientList()) ?? []
	};
}
