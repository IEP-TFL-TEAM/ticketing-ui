import pb from '$lib/api/pocketbaseClient';
import { currentUser } from '$lib/stores/auth';
import { get } from 'svelte/store';
import { error, redirect } from '@sveltejs/kit';

export async function load() {
	if (!pb.authStore.isValid) {
		currentUser.set(null);
		redirect(307, '/login');
	}

	if (get(currentUser).role !== 'admin') {
		error(404, 'error');
	}
}
