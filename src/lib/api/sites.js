import pb from './pocketbaseClient';

const addSite = async (data) => {
	const record = await pb.collection('sites').create(data);
	return record;
};

const updateSite = async (data) => {
	const record = await pb.collection('sites').update(data.id, data);
	return record;
};

const getSiteById = async (id) => {
	const record = await pb.collection('sites').getOne(id, {
		expand: 'areaId, locationId'
	});

	return record;
};

const getSiteList = async () => {
	const records = await pb.collection('sites').getFullList({
		sort: '-created',
		expand: 'areaId, locationId'
	});
	return records;
};

export { addSite, updateSite, getSiteById, getSiteList };
