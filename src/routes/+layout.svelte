<script>
	import '../app.postcss';

	import { currentUser } from '$lib/stores/auth';
	import { navigating } from '$app/stores';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { Toast, initializeStores, getDrawerStore, Drawer, Modal } from '@skeletonlabs/skeleton';
	import SpinnerOverlay from '$lib/components/layout/SpinnerOverlay.svelte';
	import pb from '$lib/api/pocketbaseClient';
	import { goto } from '$app/navigation';
	import { modalComponentRegistry } from '$lib/utils/modalComponentRegistry';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import CreateTicket from '$lib/components/drawers/tickets/CreateTicket.svelte';
	import AddRecipient from '$lib/components/drawers/recipients/AddRecipient.svelte';
	import UpdateRecipient from '$lib/components/drawers/recipients/UpdateRecipient.svelte';
	import CreateRequest from '$lib/components/drawers/change-requests/CreateRequest.svelte';
	import CreateRoutineMaintenance from '$lib/components/drawers/routine-maintenance/CreateRoutineMaintenance.svelte';
	import SidebarDrawer from '$lib/components/home/SidebarDrawer.svelte';
	import { IconChevronsRight } from '@tabler/icons-svelte';

	initializeStores();

	const drawerStore = getDrawerStore();

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

	function toggleSidebar(id, position) {
		drawerStore.open({
			id,
			position,
			bgDrawer: 'bg-surface-800 dark:bg-secondary-800 text-white',
			bgBackdrop: 'bg-black/70',
			width: 'w-[290px]',
			padding: 'p-0',
			rounded: 'rounded-none'
		});
	}
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
	background="bg-white dark:bg-neutral-700"
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
	{:else if $drawerStore.id === 'updateRecipient'}
		<UpdateRecipient />
	{:else if $drawerStore.id === 'createRequest'}
		<CreateRequest />
	{:else if $drawerStore.id === 'createRoutine'}
		<CreateRoutineMaintenance />
	{:else if $drawerStore.id === 'sidebarDrawer'}
		<SidebarDrawer />
	{/if}
</Drawer>

<div class="relative min-h-screen md:flex bg-white dark:bg-[#252424]">
	{#if $currentUser}
		<button
			type="button"
			on:click={() => toggleSidebar('sidebarDrawer', 'left')}
			class="block xl:hidden fixed top-1 left-1 btn rounded bg-primary-500 p-4"
		>
			<IconChevronsRight size={30} class="text-white" />
		</button>

		<Sidebar />

		<div class="h-full w-full px-20 py-20 xl:py-18">
			<slot />
		</div>
	{:else}
		<slot />
	{/if}
</div>
