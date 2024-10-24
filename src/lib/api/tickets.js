import pb from './pocketbaseClient';
import { parseFilters } from '../utils/parsers';

export const expand =
	'reportedBy, categoryLevelId, teamIds, teamEquipmentIds, categoryId, regionId, siteId, areaId, faultTypeId, closedBy, solution, cause, technicianId';

const createTicket = async (data) => {
	const record = await pb.collection('tickets').create({
		...data,
		reportedBy: pb.authStore.model.id
	});
	return record;
};

const updateTicket = async (ticket) => {
	const record = await pb.collection('tickets').update(ticket.id, ticket, { expand });
	return record;
};

const updateTicketById = async (id, ticket) => {
	const record = await pb.collection('tickets').update(id, ticket, { expand });
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

const sendBroadcastEmail = async ({
	id,
	email,
	cc,
	subject,
	incidentStart,
	description,
	location,
	assignedTeams,
	update,
	ticketNumber
}) => {
	const response = await pb.send(`/api/send-broadcast`, {
		method: 'POST',
		body: {
			id,
			email,
			cc,
			subject,
			incidentStart,
			description,
			location,
			assignedTeams,
			update,
			ticketNumber
		}
	});
	return response;
};

export {
	updateTicket,
	updateTicketById,
	getTicketById,
	getTickets,
	createTicket,
	getAllTickets,
	sendBroadcastEmail
};
