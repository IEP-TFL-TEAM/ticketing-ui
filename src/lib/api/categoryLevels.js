import pb from './pocketbaseClient';

const expand = 'categoryId';

const addCategoryLevel = async (data) => {
	const record = await pb.collection('categorylevels').create(data, { expand });

	return record;
};

const updateCategoryLevel = async (category) => {
	const record = await pb.collection('categorylevels').update(category.id, category, { expand });

	return record;
};

const getCategoryLevels = async () => {
	const records = await pb.collection('categorylevels').getFullList({
		sort: '-created',
		expand
	});

	return records;
};

export { addCategoryLevel, updateCategoryLevel, getCategoryLevels };
