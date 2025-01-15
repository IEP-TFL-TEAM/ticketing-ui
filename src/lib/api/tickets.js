import pb from './pocketbaseClient';
import { parseFilters } from '../utils/parsers';

export const expand =
	'reportedBy, categoryLevelId, teamIds, departmentIds, teamEquipmentIds, categoryId, regionId, siteId, areaId, faultTypeId, closedBy, solution, cause, technicianId, servicesListIds';

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
	const records = await pb.collection('tickets').getFullList(500, { expand });
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
	incidentEnd,
	description,
	location,
	assignedTeams,
	update,
	ticketNumber,
	broadcastType
}) => {
	const response = await pb.send(`/api/send-broadcast`, {
		method: 'POST',
		body: {
			id,
			email,
			cc,
			subject,
			incidentStart,
			incidentEnd,
			description,
			location,
			assignedTeams,
			update,
			ticketNumber,
			broadcastType
		}
	});
	return response;
};

const sendTicketCreationNotification = async ({
	id,
	email,
	cc,
	subject,
	incidentStart,
	description,
	ticketNumber,
	category,
	severity,
	technician,
	actionType = 'create'
}) => {
	const response = await pb.send(`/api/send-incident-creation-notification`, {
		method: 'POST',
		body: {
			id,
			email,
			cc,
			subject,
			incidentStart,
			description,
			ticketNumber,
			category,
			severity,
			technician,
			actionType
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
	sendBroadcastEmail,
	sendTicketCreationNotification
};
