<script>
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import pb from '$lib/api/pocketbaseClient';
	import { exportChangeRequests } from '$lib/utils/exportChangeRequests';
	import { expand } from '$lib/api/changeRequests';
	import { getDrawerStore, getToastStore } from '@skeletonlabs/skeleton';
	import { IconPlus } from '@tabler/icons-svelte';

	import ChangeRequestTable from '$lib/components/change-requests/ChangeRequestTable.svelte';
	import ChangeRequestFilters from '$lib/components/change-requests/ChangeRequestFilters.svelte';
	import ExportButton from '$lib/components/layout/ExportButton.svelte';
	import ErrorPage from '$lib/components/layout/ErrorPage.svelte';

	export let data;

	$: ({ filters, teams, changeTeams, sites, staff, servicesList, requests, regions, areas } = data);

	const drawerStore = getDrawerStore();
	const toastStore = getToastStore();
	let loading = false;

	$: pageSettings = {
		page: data.requests.page - 1,
		limit: data.requests.perPage,
		size: data.requests.totalItems ?? 0,
		amounts: [1, 5, 10, 20]
	};

	$: pageSettings.size = data.requests.totalItems;

	function triggerDrawer(id, position) {
		drawerStore.open({
			id,
			position,
			meta: {
				staff,
				teams,
				changeTeams,
				sites,
				servicesList,
				regions,
				areas
			}
		});
	}

	async function handleExport(exportType) {
		loading = true;
		exportType(data.requests.items);
		loading = false;
	}

	async function handleExportData() {
		handleExport(exportChangeRequests);
	}

	function updateRequests(e) {
		const { record } = e;

		switch (e.action) {
			case 'create':
				requests = { ...requests, items: [record, ...requests.items] };
				break;

			case 'delete':
				requests = {
					...requests,
					items: requests.items.filter((item) => item !== record)
				};
				break;

			case 'update':
				requests = {
					...requests,
					items: [record, ...requests.items.filter((item) => item.id !== record.id)]
				};
				break;

			default:
				return;
		}
	}

	let unSubscribe;

	onMount(async () => {
		unSubscribe = await pb.collection('changerequests').subscribe(
			'*',
			async (e) => {
				toastStore.clear();
				toastStore.trigger({
					message: `A Change Requst has been ${e.action}d!`,
					action: {
						label: 'View',
						response: () => goto(`/change-requests/${e.record.id}`)
					},
					timeout: 3000
				});

				updateRequests(e);
			},
			{
				expand
			}
		);
	});

	onDestroy(() => {
		unSubscribe?.();
	});
</script>

{#if !requests}
	<ErrorPage />
{:else}
	<div class="w-full mt-5 transition-colors rounded-none">
		<div class="flex justify-between">
			<h1 class="h1 font-extrabold">Change Requests</h1>

			<div class="flex items-center gap-2">
				<ExportButton
					bind:loading
					label="Requests"
					{handleExportData}
					noRecords={requests.items.length === 0}
				/>

				<button
					type="button"
					class="btn rounded-none variant-filled-primary"
					on:click={() => triggerDrawer('createRequest', 'right')}
				>
					<IconPlus size={20} />
					<span> New Change Request </span>
				</button>
			</div>
		</div>
	</div>

	<ChangeRequestFilters {filters} {pageSettings} {areas} {regions} {sites} {teams} {staff} />
	<ChangeRequestTable {requests} />
{/if}
