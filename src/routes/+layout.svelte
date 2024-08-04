<script>
	import '../app.postcss';

	import { currentUser } from '$lib/stores/auth';
	import { navigating } from '$app/stores';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { Toast, initializeStores, getToastStore, getDrawerStore } from '@skeletonlabs/skeleton';
	import SpinnerOverlay from '$lib/components/layout/SpinnerOverlay.svelte';
	import pb from '$lib/api/pocketbaseClient';
	import { goto } from '$app/navigation';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';

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

<div class="relative bg-white dark:bg-[#252424] min-h-screen md:flex">
	{#if $currentUser}
		<Sidebar />

		<div class="h-full w-full p-12">
			<slot />
		</div>
	{:else}
		<slot />
	{/if}
</div>
