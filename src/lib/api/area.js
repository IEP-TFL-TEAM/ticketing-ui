import pb from './pocketbaseClient';

const addArea = async (data) => {
	const record = await pb.collection('area').create(data);
	return record;
};

const updateArea = async (data) => {
	const record = await pb.collection('area').update(data.id, data);
	return record;
};

const getAreaList = async () => {
	const records = await pb.collection('area').getFullList({
		sort: '-created',
		expand: 'regionId'
	});
	return records;
};

export { addArea, updateArea, getAreaList };
