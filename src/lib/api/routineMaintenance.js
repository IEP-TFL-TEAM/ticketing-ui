import pb from './pocketbaseClient';
import { parseFilters } from '$lib/utils/parsers';

export const expand =
	'requestee, siteId, teamIds, maintenanceTeamId, servicesListIds, areaId, regionId';

const createRoutineMaintenance = async (data) => {
	const record = await pb.collection('routinemaintenance').create(data, { expand });
	return record;
};

const updateRoutineMaintenance = async (id, routine) => {
	const record = await pb.collection('routinemaintenance').update(id, routine, { expand });
	return record;
};

const getRoutineMaintenanceById = async (id) => {
	const record = await pb.collection('routinemaintenance').getOne(id, { expand });
	return record;
};

const getRoutines = async (filters) => {
	const records = await pb.collection('routinemaintenance').getList(filters.page, filters.perPage, {
		sort: '-updated',
		expand,
		filter: parseFilters(filters)
	});
	return records;
};

const getAllRoutines = async () => {
	const records = await pb.collection('routinemaintenance').getFullList({ expand });
	return records;
};

const sendRoutineCreationNotification = async ({
	id,
	email,
	subject,
	startDate,
	objective,
	ticketNumber
}) => {
	const response = await pb.send(`/api/send-routine-creation-notification`, {
		method: 'POST',
		body: {
			id,
			email,
			subject,
			startDate,
			objective,
			ticketNumber
		}
	});

	return response;
};

export {
	updateRoutineMaintenance,
	getRoutineMaintenanceById,
	getRoutines,
	createRoutineMaintenance,
	getAllRoutines,
	sendRoutineCreationNotification
};
