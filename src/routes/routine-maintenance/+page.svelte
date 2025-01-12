<script>
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import pb from '$lib/api/pocketbaseClient';
	import { exportRoutineMaintenance } from '$lib/utils/exportRoutineMaintenance';
	import { expand } from '$lib/api/routineMaintenance';
	import { getDrawerStore, getToastStore } from '@skeletonlabs/skeleton';
	import { IconPlus } from '@tabler/icons-svelte';

	import ExportButton from '$lib/components/layout/ExportButton.svelte';
	import RoutineMaintenanceFilters from '$lib/components/routine-maintenace/RoutineMaintenanceFilters.svelte';
	import RoutineMaintenanceTable from '$lib/components/routine-maintenace/RoutineMaintenanceTable.svelte';
	import ErrorPage from '$lib/components/layout/ErrorPage.svelte';

	export let data;

	$: ({ filters, teams, maintenanceTeams, sites, staff, routines, servicesList, areas, regions } =
		data);

	const drawerStore = getDrawerStore();
	const toastStore = getToastStore();
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
				sites,
				servicesList,
				areas,
				regions
			}
		});
	}

	async function handleExport(exportType) {
		loading = true;
		exportType(data.routines.items);
		loading = false;
	}

	async function handleExportData() {
		handleExport(exportRoutineMaintenance);
	}

	function updateRoutines(e) {
		const { record } = e;

		switch (e.action) {
			case 'create':
				routines = { ...routines, items: [record, ...routines.items] };
				break;

			case 'delete':
				routines = {
					...routines,
					items: routines.items.filter((item) => item !== record)
				};
				break;

			case 'update':
				routines = {
					...routines,
					items: [record, ...routines.items.filter((item) => item.id !== record.id)]
				};
				break;

			default:
				return;
		}
	}

	let unSubscribe;

	onMount(async () => {
		unSubscribe = await pb.collection('routinemaintenance').subscribe(
			'*',
			async (e) => {
				toastStore.clear();
				toastStore.trigger({
					message: `A Routine Maintenance has been ${e.action}d!`,
					action: {
						label: 'View',
						response: () => goto(`/routine-maintenance/${e.record.id}`)
					},
					timeout: 3000
				});

				updateRoutines(e);
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

{#if !routines}
	<ErrorPage />
{:else}
	<div class="w-full mt-5 transition-colors rounded-none">
		<div class="flex justify-between">
			<h1 class="h1 font-extrabold">Planned / Routine Maintenances</h1>

			<div class="flex items-center gap-2">
				<ExportButton
					bind:loading
					label="Routines"
					{handleExportData}
					noRecords={routines.items.length === 0}
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

	<RoutineMaintenanceFilters {filters} {pageSettings} {areas} {regions} {sites} {teams} {staff} />
	<RoutineMaintenanceTable {routines} />
{/if}
