import { currentUser } from '$lib/stores/auth';
import { get } from 'svelte/store';
import { error } from '@sveltejs/kit';

export async function load() {
	const role = get(currentUser).role;
	if (role !== 'admin') {
		error(404, 'error');
	}
}
