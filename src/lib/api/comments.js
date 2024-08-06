import pb from './pocketbaseClient';

const createComment = async ({ ticketId, content }) => {
	const record = await pb.collection('comments').create(
		{
			ticketId,
			content,
			userId: pb.authStore.model.id
		},
		{ expand: 'userId, ticketId' }
	);
	return record;
};

const getCommentsByTicketId = async (id) => {
	const records = await pb.collection('comments').getFullList(200, {
		sort: '+created',
		expand: 'userId, ticketId',
		filter: `ticketId = '${id}'`
	});

	return records;
};

export { createComment, getCommentsByTicketId };
