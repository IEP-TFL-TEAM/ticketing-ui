import pb from './pocketbaseClient';
import { parseFilters } from '../utils/parsers';

export const expand =
	'reportedBy, categoryLevelId, teamId, teamEquipmentId, categoryId, regionId, siteId, areaId, faultTypeId, closedBy, solution, causedBy, technicianId';

const createTicket = async (data) => {
	const record = await pb.collection('tickets').create({
		...data,
		reportedBy: pb.authStore.model.id
	});
	return record;
};

const updateTicket = async (ticket) => {
	pb.autoCancellation(false);
	const record = await pb.collection('tickets').update(ticket.id, ticket);
	pb.autoCancellation(false);
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

const getAllTickets = async () => {
	const records = await pb.collection('tickets').getFullList({ expand });
	return records;
};

const getTicketById = async (id) => {
	const record = await pb.collection('tickets').getOne(id, { expand });
	return record;
};

export { updateTicket, getTicketById, getTickets, createTicket, getAllTickets };
