import pb from './pocketbaseClient';
import { history } from '$lib/stores/historyStore';
import { get } from 'svelte/store';
import { currentUser } from '$lib/stores/auth';

const expand = 'ticketId';
let selectedTicket;

if (get(currentUser)) {
	pb.collection('history').subscribe('*', async function (e) {
		if (selectedTicket === e.record.ticketId) {
			history.update((r) => [e.record, ...r]);
		}
	});
}

const getHistoryByTicketId = async (ticketId) => {
	const records = await pb.collection('history').getFullList(500, {
		sort: '-created',
		filter: `ticketId = '${ticketId}'`,
		expand
	});

	selectedTicket = ticketId;
	history.set(records);
	return records;
};

const getHistoryById = async (id) => {
	const record = await pb.collection('history').getOne(id, { expand });
	return record;
};

const getRecentHistory = async () => {
	const record = await pb.collection('history').getList(0, 30, { sort: '-created', expand });

	history.set(record.items);
	return record.items;
};

export { getHistoryById, getHistoryByTicketId, getRecentHistory };
