import pb from './pocketbaseClient';

const createChangeTeam = async (data) => {
	const record = await pb.collection('changeteams').create(data);
	return record;
};

const getChangeTeams = async () => {
	const records = await pb.collection('changeteams').getFullList();
	return records;
};

const updateChangeTeam = async (id, data) => {
	const record = await pb.collection('changeteams').update(id, data);
	return record;
};

export { createChangeTeam, getChangeTeams, updateChangeTeam };
