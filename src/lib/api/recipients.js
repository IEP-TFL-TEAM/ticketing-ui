import pb from './pocketbaseClient';

const addRecipient = async (data) => {
	const record = await pb.collection('recipients').create({
		...data,
		verified: true
	});
	return record;
};

const updateRecipient = async (id, data) => {
	const record = await pb.collection('recipients').update(id, data);
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

const getVerifiedBroadcastRecipients = async () => {
	const records = await pb.collection('recipients').getFullList({
		sort: '-created',
		filter: `verified = true && type = 'BROADCAST'`
	});
	return records;
};

const getVerifiedCCEmailRecipient = async () => {
	const records = await pb.collection('recipients').getFullList({
		sort: '-created',
		filter: `verified = true && type = 'CC'`
	});
	return records;
};

export {
	addRecipient,
	updateRecipient,
	updateRecipientByStatus,
	removeRecipient,
	getRecipientList,
	getVerifiedBroadcastRecipients,
	getVerifiedCCEmailRecipient
};
