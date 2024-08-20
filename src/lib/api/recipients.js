import pb from './pocketbaseClient';

const addRecipient = async (data) => {
	const record = await pb.collection('recipients').create({
		...data,
		verified: true
	});
	return record;
};

const updateRecipient = async (data) => {
	const record = await pb.collection('recipients').update(data.id, data);
	return record;
};

const updateRecipientByStatus = async (id, data) => {
	const record = await pb.collection('recipients').update(id, data);
	return record;
};

const removeRecipient = async (id) => {
	const record = await pb.collection('recipients').delete(id);
	return record;
};

const getRecipientList = async () => {
	const records = await pb.collection('recipients').getFullList({
		sort: '-created'
	});
	return records;
};

export {
	addRecipient,
	updateRecipient,
	updateRecipientByStatus,
	removeRecipient,
	getRecipientList
};
