import pb from './pocketbaseClient';

const addServiceList = async (data) => {
	const record = await pb.collection('serviceslist').create(data);
	return record;
};

const updateServiceList = async (data) => {
	const record = await pb.collection('serviceslist').update(data.id, data);
	return record;
};

const getServiceListById = async (id) => {
	const record = await pb.collection('serviceslist').getOne(id);

	return record;
};

const getServicesList = async () => {
	const records = await pb.collection('serviceslist').getFullList({
		sort: '-created'
	});
	return records;
};

export { addServiceList, updateServiceList, getServiceListById, getServicesList };
