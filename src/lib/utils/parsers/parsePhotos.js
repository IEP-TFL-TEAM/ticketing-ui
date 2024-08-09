import pb from '$lib/api/pocketbaseClient';

export const parsePhotos = (records) =>
	records.map((record) => {
		const url = pb.getFileUrl(record, record.attachment);
		return { ...record, url };
	});
