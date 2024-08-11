import pb from './pocketbaseClient';

const expand = 'areaId';

const addSite = async (data) => {
	const record = await pb.collection('sites').create(data, { expand });

	return record;
};

const updateSite = async (data) => {
	const record = await pb.collection('sites').update(data.id, data, { expand });

	return record;
};

const getSiteList = async () => {
	const records = await pb.collection('sites').getFullList({
		sort: '-created',
		expand
	});

	return records;
};

export { addSite, updateSite, getSiteList };
