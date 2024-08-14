import pb from './pocketbaseClient';

const createTeam = async (name) => {
	const record = await pb.collection('teams').create({ name });
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

const getTeamUsers = async () => {
	const records = await pb
		.collection('users')
		.getFullList(100, { expand: 'teamId', filter: `role = 'field'` });
	return records;
};

export { createTeam, getTeamById, getTeams, assignTeam, getTeamUsers };
