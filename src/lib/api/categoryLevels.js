import pb from './pocketbaseClient';

const addCategoryLevel = async (data) => {
	const record = await pb.collection('categorylevels').create(data);
	return record;
};

const updateCategoryLevel = async (category) => {
	const record = await pb.collection('categorylevels').update(category.id, category);
	return record;
};

const getCategoryLevels = async () => {
	const records = await pb.collection('categorylevels').getFullList({
		sort: '-created',
		expand: 'categoryId'
	});
	return records;
};

export { addCategoryLevel, updateCategoryLevel, getCategoryLevels };
