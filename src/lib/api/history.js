import pb from './pocketbaseClient';
import { history } from '$lib/stores/historyStore';

let selectedTicket;

pb.collection('history').subscribe('*', async function (e) {
	if (selectedTicket === e.record.ticketId) {
		history.update((r) => [e.record, ...r]);
	}
});

const getHistoryByTicketId = async (ticketId) => {
	const records = await pb.collection('history').getFullList({
		sort: '-created',
		filter: `ticketId = '${ticketId}'`,
		expand: 'ticketId'
	});

	selectedTicket = ticketId;
	history.set(records);
	return records;
};

const getHistoryById = async (id) => {
	const record = await pb.collection('history').getOne(id);
	return record;
};

const getRecentHistory = async () => {
	const record = await pb
		.collection('history')
		.getList(0, 30, { sort: '-created', expand: 'ticketId' });

	history.set(record.items);
	return record.items;
};

export { getHistoryById, getHistoryByTicketId, getRecentHistory };
