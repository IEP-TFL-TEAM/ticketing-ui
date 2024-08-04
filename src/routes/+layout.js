import { currentUser } from '$lib/stores/auth';
import pb from '$lib/api/pocketbaseClient';

export async function load() {
	if (!pb.authStore.isValid) {
		currentUser.set(null);
	}
}
