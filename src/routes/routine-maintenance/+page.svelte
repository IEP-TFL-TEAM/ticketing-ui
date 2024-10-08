<script>
	import { exportRoutineMaintenance } from '$lib/utils/exportRoutineMaintenance';
	import { getAllRoutines } from '$lib/api/routineMaintenance';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { IconPlus } from '@tabler/icons-svelte';

	import ExportButton from '$lib/components/layout/ExportButton.svelte';
	import RoutineMaintenanceFilters from '$lib/components/routine-maintenace/RoutineMaintenanceFilters.svelte';
	import RoutineMaintenanceTable from '$lib/components/routine-maintenace/RoutineMaintenanceTable.svelte';

	export let data;

	$: filters = data.filters;
	$: routines = data.routines.items;
	$: teams = data.teams;
	$: maintenanceTeams = data.maintenanceTeams;
	$: sites = data.sites;
	$: staff = data.staff;

	const drawerStore = getDrawerStore();
	let loading = false;

	$: pageSettings = {
		page: data.routines.page - 1,
		limit: data.routines.perPage,
		size: data.routines.totalItems ?? 0,
		amounts: [1, 5, 10, 20]
	};

	$: pageSettings.size = data.routines.totalItems;

	function triggerDrawer(id, position) {
		drawerStore.open({
			id,
			position,
			meta: {
				staff,
				teams,
				maintenanceTeams,
				sites
			}
		});
	}

	async function handleExport(exportType) {
		loading = true;
		const routines = await getAllRoutines();
		exportType(routines);
		loading = false;
	}

	async function handleExportData() {
		handleExport(exportRoutineMaintenance);
	}
</script>

<div class="w-full mt-5 transition-colors rounded-none">
	<div class="flex justify-between">
		<h1 class="h1 font-extrabold">Routine Maintenance Forms</h1>

		<div class="flex items-center gap-2">
			<ExportButton
				bind:loading
				label="Routines"
				{handleExportData}
				noRecords={routines.length === 0}
			/>

			<button
				type="button"
				class="btn rounded-none variant-filled-primary"
				on:click={() => triggerDrawer('createRoutine', 'right')}
			>
				<IconPlus size={20} />
				<span> New Routine Maintenance </span>
			</button>
		</div>
	</div>
</div>

<RoutineMaintenanceFilters {filters} {pageSettings} requestees={staff} />
<RoutineMaintenanceTable {routines} />
