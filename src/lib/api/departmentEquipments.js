import pb from './pocketbaseClient';

export const expand = 'departmentId';

const addDepartmentEquipment = async (data) => {
	const record = await pb.collection('departmentEquipments').create(data);
	return record;
};

const updateDepartmentEquipment = async (data) => {
	const record = await pb.collection('departmentEquipments').update(data.id, data, { expand });
	return record;
};

const getDepartmentEquipmentList = async () => {
	const records = await pb.collection('departmentEquipments').getFullList({
		sort: '-created',
		expand
	});
	return records;
};

export { addDepartmentEquipment, updateDepartmentEquipment, getDepartmentEquipmentList };
