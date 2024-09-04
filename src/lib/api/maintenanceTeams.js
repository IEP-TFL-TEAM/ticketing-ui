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

const getMembersByMaintenanceTeamId = async (id) => {
	const records = await pb
		.collection('maintenanceteam_members')
		.getFullList(100, { filter: `maintenanceTeamId = '${id}'`, expand: 'maintenanceTeamId' });
	return records;
};

export {
	createMaintenanceTeam,
	getMaintenanceTeams,
	updateMaintenanceTeam,
	getMembersByMaintenanceTeamId
};
