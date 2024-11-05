import pb from '$lib/api/pocketbaseClient';
import { getTickets } from '$lib/api/tickets';
import { getTeams } from '$lib/api/teams';
import { getCategories } from '$lib/api/categories';
import { getCategoryLevels } from '$lib/api/categoryLevels';
import { getRegionList } from '$lib/api/region';
import { getAreaList } from '$lib/api/area';
import { getSiteList } from '$lib/api/sites';
import { getTeamEquipmentList } from '$lib/api/teamEquipments';
import { getFaultList } from '$lib/api/faultTypes';
import { getRecentHistory } from '$lib/api/history';
import { getCauseCodes } from '$lib/api/causeCodes';
import { getTechnicians } from '$lib/api/technicians';
import { getServicesList } from '$lib/api/servicesList';

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
		ticketNumber: url.searchParams.get('ticketNumber'),
		status: url.searchParams.get('status')
	};

	try {
		await getRecentHistory();
		const results = await Promise.allSettled([
			getTickets(filters),
			getTeams(),
			getCategories(),
			getCategoryLevels(),
			getRegionList(),
			getAreaList(),
			getSiteList(),
			getTeamEquipmentList(),
			getFaultList(),
			getCauseCodes(),
			getTechnicians(),
			getServicesList()
		]);

		const [
			tickets,
			teams,
			categories,
			categoryLevels,
			regions,
			areas,
			sites,
			teamEquipments,
			faultTypeList,
			causeCodes,
			technicians,
			servicesList
		] = results.map((result) => (result.status === 'fulfilled' ? result.value : []));

		return {
			filters,
			tickets,
			teams,
			categories,
			categoryLevels,
			regions,
			areas,
			sites,
			teamEquipments,
			faultTypeList,
			causeCodes,
			technicians,
			servicesList
		};
	} catch (error) {
		console.error(error);
		return [];
	}
}
