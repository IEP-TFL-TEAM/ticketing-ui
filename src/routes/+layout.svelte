<script>
	import '../app.postcss';

	import { currentUser } from '$lib/stores/auth';
	import { navigating } from '$app/stores';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import {
		Toast,
		initializeStores,
		getToastStore,
		getDrawerStore,
		Drawer
	} from '@skeletonlabs/skeleton';
	import SpinnerOverlay from '$lib/components/layout/SpinnerOverlay.svelte';
	import pb from '$lib/api/pocketbaseClient';
	import { goto } from '$app/navigation';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import CreateTicket from '$lib/components/drawers/tickets/CreateTicket.svelte';
	import EditTicket from '$lib/components/drawers/tickets/EditTicket.svelte';

	initializeStores();

	const drawerStore = getDrawerStore();
	const toastStore = getToastStore();

	currentUser.subscribe((user) => {
		if (!user) {
			goto('/login');
		}
	});

	beforeNavigate((navigation) => {
		if (!pb.authStore.isValid) {
			if ($currentUser) {
				currentUser.set(null);
				navigation.cancel();
			}
		}
	});

	afterNavigate(() => {
		drawerStore.close();
		toastStore.clear();
	});
</script>

{#if $navigating}
	<SpinnerOverlay />
{/if}

<Toast position="t" buttonDismiss="btn-icon bg-transparent border border-white/50" />

<Drawer
	position="right"
	width="md:w-2/3 xl:w-1/3 w-full"
	rounded="rounded-none"
	bgDrawer="bg-white dark:bg-[#252424]"
	bgBackdrop="!bg-gray-500/40 dark:!bg-black/40"
>
	{#if $drawerStore.id === 'createTicket'}
		<CreateTicket />
	{:else if $drawerStore.id === 'editTicket'}
		<EditTicket />
	{/if}
</Drawer>

<div class="relative bg-gray-200 dark:bg-[#252424] min-h-screen md:flex">
	{#if $currentUser}
		<Sidebar />

		<div class="h-full w-full p-12">
			<slot />
		</div>
	{:else}
		<slot />
	{/if}
</div>
