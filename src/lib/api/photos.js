import pb from './pocketbaseClient';

const createPhoto = async (data) => {
	const record = await pb.collection('photos').create(
		{
			...data,
			userId: pb.authStore.model.id
		},
		{ expand: 'userId' }
	);

	return record;
};

const getPhotoById = async (id) => {
	const record = await pb.collection('photos').getOne(id, {
		sort: '+created',
		expand: 'userId'
	});

	return record;
};

const getPhotosByTicketId = async (id) => {
	const records = await pb.collection('photos').getFullList(200, {
		sort: '+created',
		expand: 'userId',
		filter: `ticketId = '${id}'`
	});

	return records;
};

export { createPhoto, getPhotoById, getPhotosByTicketId };
