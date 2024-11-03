import pb from './pocketbaseClient';

const createDepartment = async (data) => {
	const record = await pb.collection('departments').create(data);
	return record;
};

const getDepartments = async () => {
	const records = await pb.collection('departments').getFullList();
	return records;
};

const updateDepartment = async (id, data) => {
	const record = await pb.collection('departments').update(id, data);
	return record;
};

export { createDepartment, getDepartments, updateDepartment };
