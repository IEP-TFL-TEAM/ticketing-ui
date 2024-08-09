import pb from './pocketbaseClient';
import { parseFilters } from '../utils/parsers';

const expand = 'reportedBy, staffId, teamId, locationId, categoryId';

const createTicket = async (data) => {
	const record = await pb.collection('tickets').create(
		{
			...data,
			reportedBy: pb.authStore.model.id
		},
		{ expand }
	);

	return record;
};

const updateTicket = async (ticket) => {
	const record = await pb.collection('tickets').update(ticket.id, ticket, { expand });

	return record;
};

const getTickets = async (filters) => {
	const records = await pb.collection('tickets').getList(filters.page, filters.perPage, {
		sort: '-updated',
		expand,
		filter: parseFilters(filters)
	});

	return records;
};

const getTicketById = async (id) => {
	const record = await pb.collection('tickets').getOne(id, { expand });

	return record;
};

export { updateTicket, getTicketById, getTickets, createTicket };
