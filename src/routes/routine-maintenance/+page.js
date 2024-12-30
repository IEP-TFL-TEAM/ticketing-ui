import pb from '$lib/api/pocketbaseClient';
import { currentUser } from '$lib/stores/auth';
import { redirect } from '@sveltejs/kit';

import { getRoutines } from '$lib/api/routineMaintenance';
import { getTeams } from '$lib/api/teams';
import { getMaintenanceTeams } from '$lib/api/maintenanceTeams';
import { getSiteList } from '$lib/api/sites';
import { getStaffList } from '$lib/api/staff';
import { getServicesList } from '$lib/api/servicesList';
import { getRegionList } from '$lib/api/region';
import { getAreaList } from '$lib/api/area';

export async function load({ url, fetch }) {
	pb.beforeSend = function (url, options) {
		options.fetch = fetch;
		return { url, options };
	};

	if (!pb.authStore.isValid) {
		currentUser.set(null);
		redirect(307, '/login');
	}

	const filters = {
		page: url.searchParams.get('page') ?? 1,
		perPage: url.searchParams.get('perPage') ?? 20,
		title: url.searchParams.get('title') ?? '',
		objective: url.searchParams.get('objective') ?? '',
		serviceImpact: url.searchParams.get('serviceImpact') ?? '',
		ticketNumber: url.searchParams.get('ticketNumber') ?? '',
		regionId: url.searchParams.get('regionId') ?? '',
		siteId: url.searchParams.get('siteId') ?? '',
		areaId: url.searchParams.get('areaId') ?? '',
		teamIds: url.searchParams.get('teamIds') ?? '',
		requestee: url.searchParams.get('requestee') ?? '',
		status: url.searchParams.get('status') ?? ''
	};

	try {
		const results = await Promise.allSettled([
			getRoutines(filters),
			getTeams(),
			getMaintenanceTeams(),
			getSiteList(),
			getStaffList(),
			getServicesList(),
			getRegionList(),
			getAreaList()
		]);

		const [routines, teams, maintenanceTeams, sites, staff, servicesList, regions, areas] =
			results.map(({ status, value }) => (status === 'fulfilled' ? value : []));

		return {
			filters,
			routines,
			teams,
			maintenanceTeams,
			sites,
			staff,
			servicesList,
			regions,
			areas
		};
	} catch (error) {
		console.error(error);
		return [];
	}
}
