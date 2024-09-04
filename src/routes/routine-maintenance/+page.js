import pb from '$lib/api/pocketbaseClient';
import { getRoutines } from '$lib/api/routineMaintenance';
import { getTeams } from '$lib/api/teams';
import { getMaintenanceTeams } from '$lib/api/maintenanceTeams';
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
		routines: (await getRoutines(filters)) ?? [],
		teams: (await getTeams()) ?? [],
		maintenanceTeams: (await getMaintenanceTeams()) ?? [],
		sites: (await getSiteList()) ?? [],
		staff: (await getStaffList()) ?? []
	};
}