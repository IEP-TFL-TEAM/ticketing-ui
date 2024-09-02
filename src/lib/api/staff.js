import pb from './pocketbaseClient';

const addStaff = async (data) => {
	const record = await pb.collection('staff').create(data);
	return record;
};

const updateStaff = async (data) => {
	const record = await pb.collection('staff').update(data.id, data);
	return record;
};

const getStaffList = async () => {
	const records = await pb.collection('staff').getFullList({
		sort: '-created'
	});
	return records;
};

export { addStaff, updateStaff, getStaffList };
