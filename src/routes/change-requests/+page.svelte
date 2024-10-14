<script>
	import { exportChangeRequests } from '$lib/utils/exportChangeRequests';
	import { getAllRequests } from '$lib/api/changeRequests';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { IconPlus } from '@tabler/icons-svelte';

	import ChangeRequestTable from '$lib/components/change-requests/ChangeRequestTable.svelte';
	import ChangeRequestFilters from '$lib/components/change-requests/ChangeRequestFilters.svelte';
	import ExportButton from '$lib/components/layout/ExportButton.svelte';
	import ErrorPage from '$lib/components/layout/ErrorPage.svelte';

	export let data;

	$: requests = data.requests.items;
	$: ({ filters, teams, changeTeams, sites, staff } = data);

	const drawerStore = getDrawerStore();
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
				sites
			}
		});
	}

	async function handleExport(exportType) {
		loading = true;
		const request = await getAllRequests();
		exportType(request);
		loading = false;
	}

	async function handleExportData() {
		handleExport(exportChangeRequests);
	}
</script>

{#if !requests}
	<ErrorPage />
{:else}
	<div class="w-full mt-5 transition-colors rounded-none">
		<div class="flex justify-between">
			<h1 class="h1 font-extrabold">Change Request Forms</h1>

			<div class="flex items-center gap-2">
				<ExportButton
					bind:loading
					label="Requests"
					{handleExportData}
					noRecords={requests.length === 0}
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

	<ChangeRequestFilters {filters} {pageSettings} requestees={staff} />
	<ChangeRequestTable {requests} />
{/if}
