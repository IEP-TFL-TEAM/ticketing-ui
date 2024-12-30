import { currentUser } from '$lib/stores/auth';
import pb from '$lib/api/pocketbaseClient';
import { redirect } from '@sveltejs/kit';

export async function load() {
	if (!pb.authStore.isValid) {
		currentUser.set(null);
		redirect(307, '/login');
	}
}
