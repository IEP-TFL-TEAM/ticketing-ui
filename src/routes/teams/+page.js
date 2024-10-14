import pb from '$lib/api/pocketbaseClient';
import { getTeams } from '$lib/api/teams';

export async function load({ url, fetch }) {
	pb.beforeSend = function (url, options) {
		options.fetch = fetch;
		return { url, options };
	};

	return { teams: (await getTeams()) ?? [] };
}
