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
		Drawer,
		Modal
	} from '@skeletonlabs/skeleton';
	import SpinnerOverlay from '$lib/components/layout/SpinnerOverlay.svelte';
	import pb from '$lib/api/pocketbaseClient';
	import { goto } from '$app/navigation';
	import { modalComponentRegistry } from '$lib/utils/modalComponentRegistry';
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

<Modal
	components={modalComponentRegistry}
	buttonNeutral="btn border border-black bg-white dark:bg-transparent dark:border-white/30 text-black dark:text-white font-medium rounded-none"
	buttonPositive="btn border border-black/30 dark:border-white/30 bg-black text-white font-medium dark:bg-gray-900 rounded-none"
	regionBackdrop="!bg-black/50"
/>

<Drawer
	position="right"
	width="md:w-1/2 w-full"
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
