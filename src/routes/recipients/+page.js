import pb from '$lib/api/pocketbaseClient';
import { getRecipientList } from '$lib/api/recipients';

export async function load({ url, fetch }) {
	pb.beforeSend = function (url, options) {
		options.fetch = fetch;
		return { url, options };
	};

	try {
		const results = await Promise.allSettled([getRecipientList()]);

		const [recipients] = results.map((result) =>
			result.status === 'fulfilled' ? result.value : []
		);

		return {
			recipients
		};
	} catch (error) {
		console.error(error);
		return [];
	}
}
