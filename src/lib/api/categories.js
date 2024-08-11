import pb from './pocketbaseClient';

const addCategory = async (data) => {
	const record = await pb.collection('categories').create(data);

	return record;
};

const updateCategory = async (category) => {
	const record = await pb.collection('categories').update(category.id, category);

	return record;
};

const getCategories = async () => {
	const records = await pb.collection('categories').getFullList({
		sort: '-created'
	});

	return records;
};

export { addCategory, updateCategory, getCategories };
