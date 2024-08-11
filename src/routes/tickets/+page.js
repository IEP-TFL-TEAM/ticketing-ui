import pb from '$lib/api/pocketbaseClient';
import { getTickets } from '$lib/api/tickets';
import { getTeams } from '$lib/api/teams';
import { getCategories } from '$lib/api/categories';
import { getCategoryLevels } from '$lib/api/categoryLevels';
import { getRegionList } from '$lib/api/region';
import { getAreaList } from '$lib/api/area';
import { getSiteList } from '$lib/api/sites';
import { getTeamEquipmentList } from '$lib/api/teamEquipment';
import { getFaultList } from '$lib/api/faultTypes';

export async function load({ url, fetch }) {
	pb.beforeSend = function (url, options) {
		options.fetch = fetch;
		return { url, options };
	};

	const filters = {
		page: url.searchParams.get('page') ?? 1,
		perPage: url.searchParams.get('perPage') ?? 20,
		title: url.searchParams.get('title'),
		description: url.searchParams.get('description'),
		count: url.searchParams.get('count'),
		status: url.searchParams.get('status'),
		severity: url.searchParams.get('severity')
	};

	return {
		filters,
		tickets: (await getTickets(filters)) ?? [],
		teams: (await getTeams()) ?? [],
		categories: (await getCategories()) ?? [],
		categoryLevels: (await getCategoryLevels()) ?? [],
		regions: (await getRegionList()) ?? [],
		areas: (await getAreaList()) ?? [],
		sites: (await getSiteList()) ?? [],
		teamEquipment: (await getTeamEquipmentList()) ?? [],
		faultTypeList: (await getFaultList()) ?? []
	};
}
