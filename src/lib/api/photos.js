import pb from './pocketbaseClient';
import { photos } from '$lib/stores/photoStore';
import { get } from 'svelte/store';
import { currentUser } from '$lib/stores/auth';

let selectedTicket;

if (get(currentUser)) {
	pb.collection('photos').subscribe('*', async function (e) {
		if (selectedTicket === e.record.ticketId) {
			// Get photo again but with related values
			if (e.action === 'create') {
				const photo = await getPhotoById(e.record.id);
				photos.update((r) => [...r, photo]);
			}
			// Just remove it
			else if (e.action === 'delete') photos.update((r) => r.filter((x) => x.id !== e.record.id));
		}
	});
}

const addPhoto = async ({ ticketId, attachment }) => {
	const record = await pb.collection('photos').create({
		ticketId,
		attachment,
		userId: pb.authStore.model.id
	});
	return record;
};

const getPhotoById = async (id) => {
	const record = await pb.collection('photos').getOne(id, {
		sort: '+created',
		expand: 'userId'
	});

	return record;
};

const getPhotosByTicketId = async (id) => {
	const records = await pb.collection('photos').getFullList(200, {
		sort: '+created',
		expand: 'userId',
		filter: `ticketId = '${id}'`
	});

	selectedTicket = id;
	photos.set(records);
};

export { addPhoto, getPhotoById, getPhotosByTicketId };
