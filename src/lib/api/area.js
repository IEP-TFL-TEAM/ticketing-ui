import pb from './pocketbaseClient';

const expand = 'regionId';

const addArea = async (data) => {
	const record = await pb.collection('area').create(data, { expand });

	return record;
};

const updateArea = async (data) => {
	const record = await pb.collection('area').update(data.id, data, { expand });

	return record;
};

const getAreaList = async () => {
	const records = await pb.collection('area').getFullList({
		sort: '-created',
		expand
	});

	return records;
};

export { addArea, updateArea, getAreaList };
