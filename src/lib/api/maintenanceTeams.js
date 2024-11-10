import pb from './pocketbaseClient';

const createMaintenanceTeam = async (data) => {
	const record = await pb.collection('maintenanceteams').create(data);
	return record;
};

const getMaintenanceTeams = async () => {
	const records = await pb.collection('maintenanceteams').getFullList();
	return records;
};

const updateMaintenanceTeam = async (id, data) => {
	const record = await pb.collection('maintenanceteams').update(id, data);
	return record;
};

export { createMaintenanceTeam, getMaintenanceTeams, updateMaintenanceTeam };
