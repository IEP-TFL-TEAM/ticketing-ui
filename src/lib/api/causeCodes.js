import pb from './pocketbaseClient';

const addCause = async (data) => {
	const record = await pb.collection('causes').create(data);
	return record;
};

const updateCause = async (data) => {
	const record = await pb.collection('causes').update(data.id, data);
	return record;
};

const removeCause = async (id) => {
	const record = await pb.collection('causes').delete(id);
	return record;
};

const getCauseCodes = async () => {
	const records = await pb.collection('causes').getFullList({
		sort: '-created'
	});
	return records;
};

export { addCause, updateCause, removeCause, getCauseCodes };
