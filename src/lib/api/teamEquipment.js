import pb from './pocketbaseClient';

const addTeamEquipment = async (data) => {
	const record = await pb.collection('teamequipments').create(data);
	return record;
};

const updateTeamEquipment = async (data) => {
	const record = await pb.collection('teamequipments').update(data.id, data);
	return record;
};

const getTeamEquipmentList = async () => {
	const records = await pb.collection('teamequipments').getFullList({
		sort: '-created',
		expand: 'teamId'
	});
	return records;
};

export { addTeamEquipment, updateTeamEquipment, getTeamEquipmentList };
