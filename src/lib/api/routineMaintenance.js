import pb from './pocketbaseClient';
import { parseFilters } from '../utils/parsers';

export const expand = 'requestee, siteId, teamIds, maintenanceTeamId';

const createRoutineMaintenance = async (data) => {
	const record = await pb.collection('routinemaintenance').create(data);
	return record;
};

const updateRoutineMaintenance = async (routine) => {
	pb.autoCancellation(false);
	const record = await pb.collection('routinemaintenance').update(routine.id, routine);
	pb.autoCancellation(false);
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

export {
	updateRoutineMaintenance,
	getRoutineMaintenanceById,
	getRoutines,
	createRoutineMaintenance,
	getAllRoutines
};