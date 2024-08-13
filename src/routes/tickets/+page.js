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
import { getRecentHistory } from '$lib/api/history';

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
		categoryId: url.searchParams.get('categoryId'),
		categoryLevelId: url.searchParams.get('categoryLevelId'),
		count: url.searchParams.get('count'),
		status: url.searchParams.get('status')
	};

	await getRecentHistory();

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
