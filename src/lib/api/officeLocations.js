import pb from './pocketbaseClient';

const addOfficeLocation = async (data) => {
	const record = await pb.collection('officelocations').create(data);
	return record;
};

const updateOfficeLocation = async (data) => {
	const record = await pb.collection('officelocations').update(data.id, data);
	return record;
};

const getOfficeLocationById = async (id) => {
	const record = await pb.collection('officelocations').getOne(id);

	return record;
};

const getOfficeLocations = async () => {
	const records = await pb.collection('officelocations').getFullList({
		sort: '-created'
	});
	return records;
};

export { addOfficeLocation, updateOfficeLocation, getOfficeLocationById, getOfficeLocations };
