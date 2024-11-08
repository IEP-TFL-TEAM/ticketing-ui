import pb from './pocketbaseClient';
import { parseFilters } from '../utils/parsers';

export const expand = 'requestee, siteId, teamIds, changeTeamId, servicesListIds, areaId, regionId';

const createRequest = async (data) => {
	const record = await pb.collection('changerequests').create(data, { expand });
	return record;
};

const updateRequest = async (id, request) => {
	const record = await pb.collection('changerequests').update(id, request, { expand });
	return record;
};

const getRequestById = async (id) => {
	const record = await pb.collection('changerequests').getOne(id, { expand });
	return record;
};

const getRequests = async (filters) => {
	const records = await pb.collection('changerequests').getList(filters.page, filters.perPage, {
		sort: '-updated',
		expand,
		filter: parseFilters(filters)
	});
	return records;
};

const getAllRequests = async () => {
	const records = await pb.collection('changerequests').getFullList({ expand });
	return records;
};

const sendRequestCreationNotification = async ({
	id,
	email,
	subject,
	startDate,
	objective,
	ticketNumber
}) => {
	const response = await pb.send(`/api/send-request-creation-notification`, {
		method: 'POST',
		body: {
			id,
			email,
			subject,
			startDate,
			objective,
			ticketNumber
		}
	});

	return response;
};

export {
	updateRequest,
	getRequestById,
	getRequests,
	createRequest,
	getAllRequests,
	sendRequestCreationNotification
};
