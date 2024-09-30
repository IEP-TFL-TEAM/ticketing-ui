import pb from '$lib/api/pocketbaseClient';
import { getRecipientList } from '$lib/api/recipients';
import { getCategories } from '$lib/api/categories';

export async function load({ url, fetch }) {
	pb.beforeSend = function (url, options) {
		options.fetch = fetch;
		return { url, options };
	};

	try {
		const results = await Promise.allSettled([getRecipientList(), getCategories()]);

		const [recipients, categories] = results.map((result) =>
			result.status === 'fulfilled' ? result.value : []
		);

		return {
			recipients,
			categories
		};
	} catch (error) {
		console.error(error);
		return {};
	}
}
