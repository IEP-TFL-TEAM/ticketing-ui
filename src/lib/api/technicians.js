import pb from './pocketbaseClient';

const addTechnician = async (data) => {
	const record = await pb.collection('technicians').create(data);
	return record;
};

const updateTechnician = async (data) => {
	const record = await pb.collection('technicians').update(data.id, data);
	return record;
};

const removeTechnician = async (id) => {
	const record = await pb.collection('technicians').delete(id);
	return record;
};

const getTechnicians = async () => {
	const records = await pb.collection('technicians').getFullList({
		sort: '-created'
	});
	return records;
};

export { addTechnician, updateTechnician, removeTechnician, getTechnicians };
