import pb from './pocketbaseClient';

const addSolution = async (data) => {
	const record = await pb.collection('solutions').create(data);
	return record;
};

const updateSolution = async (data) => {
	const record = await pb.collection('solutions').update(data.id, data);
	return record;
};

const removeSolution = async (id) => {
	const record = await pb.collection('solutions').delete(id);
	return record;
};

const getSolutionCodes = async () => {
	const records = await pb.collection('solutions').getFullList({
		sort: '-created'
	});
	return records;
};

export { addSolution, updateSolution, removeSolution, getSolutionCodes };
