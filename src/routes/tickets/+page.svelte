<script>
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import pb from '$lib/api/pocketbaseClient';
	import { getDrawerStore, getToastStore } from '@skeletonlabs/skeleton';
	import { IconPlus, IconFilter } from '@tabler/icons-svelte';

	import TicketFilters from '$lib/components/tickets/TicketFilters.svelte';
	import TicketCard from '$lib/components/tickets/TicketCard.svelte';

	export let data;

	$: filters = data.filters;
	$: tickets = data.tickets;
	$: teams = data.teams;
	$: categories = data.categories;
	$: categoryLevels = data.categoryLevels;
	$: regions = data.regions;
	$: areas = data.areas;
	$: sites = data.sites;
	$: teamEquipment = data.teamEquipment;
	$: faultTypeList = data.faultTypeList;

	const drawerStore = getDrawerStore();
	const toastStore = getToastStore();

	let showFilters = true;

	function triggerDrawer(id, position) {
		drawerStore.open({
			id,
			position,
			meta: {
				teams,
				categories,
				categoryLevels,
				regions,
				areas,
				sites,
				teamEquipment,
				faultTypeList
			}
		});
	}

	function updateTickets(e) {
		const { record } = e;

		switch (e.action) {
			case 'create':
				tickets = { ...tickets, items: [record, ...tickets.items] };
				break;

			case 'delete':
				tickets = {
					...tickets,
					items: tickets.items.filter((item) => item !== record)
				};
				break;

			case 'update':
				tickets = {
					...tickets,
					items: [record, ...tickets.items.filter((item) => item.id !== record.id)]
				};
				break;

			default:
				return;
		}
	}

	let unSubscribe;

	onMount(async () => {
		unSubscribe = await pb.collection('tickets').subscribe(
			'*',
			async (e) => {
				toastStore.trigger({
					message: `A ticket has been ${e.action}d! ${e.record.expand.reportedBy.firstName} ${e.record.expand.reportedBy.lastName}`,
					action: {
						label: 'View',
						response: () => goto(`tickets/${e.record.id}`)
					}
				});

				updateTickets(e);
			},
			{
				expand:
					'reportedBy, categoryLevelId, teamId, teamEquipmentId, categoryId, regionId, siteId, areaId, faultTypeId'
			}
		);
	});

	onDestroy(() => {
		unSubscribe?.();
	});
</script>

<div class="flex justify-between items-center mb-8">
	<h1 class="h1 font-extrabold">Tickets</h1>

	<div class="flex justify-between items-center gap-4">
		<button
			type="button"
			class="btn rounded-none variant-outline-primary"
			on:click={() => (showFilters = !showFilters)}
		>
			<IconFilter size={20} />
			<span>
				{showFilters ? 'Hide Filters' : 'Show Filters'}
			</span>
		</button>

		<button
			type="button"
			class="btn rounded-none variant-filled-primary"
			on:click={() => triggerDrawer('createTicket', 'right')}
		>
			<IconPlus size={20} />
			<span> New Ticket </span>
		</button>
	</div>
</div>

<TicketFilters {filters} bind:showFilters />
<TicketCard {tickets} />
