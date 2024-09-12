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
	import AddRecipient from '$lib/components/drawers/recipients/AddRecipient.svelte';
	import CreateTeam from '$lib/components/drawers/teams/CreateTeam.svelte';
	import CreateRequest from '$lib/components/drawers/change-requests/CreateRequest.svelte';
	import CreateRoutineMaintenance from '$lib/components/drawers/routine-maintenance/CreateRoutineMaintenance.svelte';

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
	});

	$: if ($navigating) toastStore.clear();
</script>

{#if $navigating}
	<SpinnerOverlay />
{/if}

<Toast position="t" buttonDismiss="btn-icon bg-transparent border border-white/50" />

<Modal
	components={modalComponentRegistry}
	buttonNeutral="btn border border-black bg-white dark:bg-transparent dark:border-white/30 text-black dark:text-white font-medium rounded-none"
	buttonPositive="btn border border-black/30 dark:border-white/30 bg-black text-white font-medium dark:bg-neutral-900 rounded-none"
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
	{:else if $drawerStore.id === 'addRecipient'}
		<AddRecipient />
	{:else if $drawerStore.id === 'createTeam'}
		<CreateTeam />
	{:else if $drawerStore.id === 'createRequest'}
		<CreateRequest />
	{:else if $drawerStore.id === 'createRoutine'}
		<CreateRoutineMaintenance />
	{/if}
</Drawer>

<div class="relative min-h-screen md:flex dark:bg-[#252424]">
	<div
		class="absolute inset-0 -z-10 h-full w-full bg-gray-100 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
	/>

	{#if $currentUser}
		<Sidebar />

		<div class="h-full w-full p-12">
			<slot />
		</div>
	{:else}
		<slot />
	{/if}
</div>
