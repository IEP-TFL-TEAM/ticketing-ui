import pb from './pocketbaseClient';

const addFault = async (data) => {
	const record = await pb.collection('faulttype').create(data);
	return record;
};

const updateFault = async (data) => {
	const record = await pb.collection('faulttype').update(data.id, data);
	return record;
};

const getFaultList = async () => {
	const records = await pb.collection('faulttype').getFullList(500, {
		sort: '-created'
	});
	return records;
};

export { addFault, updateFault, getFaultList };
