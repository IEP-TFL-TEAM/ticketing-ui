import pb from './pocketbaseClient';

const addRegion = async (data) => {
	const record = await pb.collection('region').create(data);

	return record;
};

const updateRegion = async (data) => {
	const record = await pb.collection('region').update(data.id, data);

	return record;
};

const getRegionList = async () => {
	const records = await pb.collection('region').getFullList({
		sort: '-created'
	});

	return records;
};

export { addRegion, updateRegion, getRegionList };
