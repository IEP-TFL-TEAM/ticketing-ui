import pb from './pocketbaseClient';

const createTeam = async (data) => {
	const record = await pb.collection('teams').create(data);
	return record;
};

const assignTeam = async (userId, teamId) => {
	const records = await pb.collection('users').update(userId, { teamId });
	return records;
};

const getTeamById = async (id) => {
	const record = await pb.collection('teams').getFirstListItem(`id="${id}"`);
	return record;
};

const getTeams = async () => {
	const records = await pb.collection('teams').getFullList();
	return records;
};

const updateTeam = async (id, data) => {
	const record = await pb.collection('teams').update(id, data);
	return record;
};

const removeTeam = async (id) => {
	const record = await pb.collection('teams').delete(id);
	return record;
};

const getTeamUsers = async () => {
	const records = await pb
		.collection('users')
		.getFullList(100, { expand: 'teamId', filter: `role = 'staff'` });
	return records;
};

export { createTeam, getTeamById, getTeams, assignTeam, getTeamUsers, removeTeam, updateTeam };
