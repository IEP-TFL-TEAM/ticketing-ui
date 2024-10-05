import pb from './pocketbaseClient';

const addComment = async (ticketId, data) => {
	const record = await pb.collection('comments').create({
		...data,
		ticketId,
		userId: pb.authStore.model.id
	});
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

export { addComment, getCommentsByTicketId };
