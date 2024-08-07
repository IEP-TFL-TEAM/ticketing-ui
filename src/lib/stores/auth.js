import { writable } from 'svelte/store';
import pb from '../api/pocketbaseClient';
import { goto } from '$app/navigation';

const currentUser = writable(pb.authStore.model);

pb.authStore.onChange(() => {
	currentUser.set(pb.authStore.model);
});

const signIn = async (email, password) => pb.collection('users').authWithPassword(email, password);

const signOut = async () => {
	pb.authStore.clear();
	goto('/login');
};

export { currentUser, signIn, signOut };
