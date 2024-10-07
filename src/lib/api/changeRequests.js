import pb from './pocketbaseClient';
import { parseFilters } from '../utils/parsers';

export const expand = 'requestee, siteId, teamIds, changeTeamId';

const createRequest = async (data) => {
	const record = await pb.collection('changerequests').create(data);
	return record;
};

const updateRequest = async (id, request) => {
	pb.autoCancellation(false);
	const record = await pb.collection('changerequests').update(id, request);
	pb.autoCancellation(false);
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

export { updateRequest, getRequestById, getRequests, createRequest, getAllRequests };
