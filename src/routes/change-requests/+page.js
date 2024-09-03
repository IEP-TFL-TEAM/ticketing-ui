import pb from '$lib/api/pocketbaseClient';
import { getRequests } from '$lib/api/changeRequests';
import { getTeams } from '$lib/api/teams';
import { getChangeTeams } from '$lib/api/changeTeams';
import { getSiteList } from '$lib/api/sites';
import { getStaffList } from '$lib/api/staff';

export async function load({ url, fetch }) {
	pb.beforeSend = function (url, options) {
		options.fetch = fetch;
		return { url, options };
	};

	const filters = {
		page: url.searchParams.get('page') ?? 1,
		perPage: url.searchParams.get('perPage') ?? 20,
		title: url.searchParams.get('title'),
		objective: url.searchParams.get('objective'),
		serviceImpact: url.searchParams.get('serviceImpact'),
		awarenessToBeMade: url.searchParams.get('awarenessToBeMade'),
		requestee: url.searchParams.get('requestee')
	};

	return {
		filters,
		requests: (await getRequests(filters)) ?? [],
		teams: (await getTeams()) ?? [],
		changeTeams: (await getChangeTeams()) ?? [],
		sites: (await getSiteList()) ?? [],
		staff: (await getStaffList()) ?? []
	};
}
