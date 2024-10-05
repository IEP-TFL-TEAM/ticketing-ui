<script>
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import pb from '$lib/api/pocketbaseClient';
	import { parseQueryParams } from '$lib/utils/parsers';
	import { getDrawerStore, getToastStore, Paginator } from '@skeletonlabs/skeleton';
	import { expand, getAllTickets } from '$lib/api/tickets';
	import { IconPlus } from '@tabler/icons-svelte';
	import { exportIncidents } from '$lib/utils/exportIncidents';

	import TicketFilters from '$lib/components/tickets/TicketFilters.svelte';
	import TicketCard from '$lib/components/tickets/TicketCard.svelte';
	import TicketHistory from '$lib/components/tickets/TicketHistory.svelte';
	import ExportButton from '$lib/components/layout/ExportButton.svelte';

	export let data;

	$: ({
		filters,
		tickets,
		teams,
		categories,
		categoryLevels,
		regions,
		areas,
		sites,
		teamEquipment,
		faultTypeList,
		causeCodes,
		technicians
	} = data);

	const drawerStore = getDrawerStore();
	const toastStore = getToastStore();

	let selectedTicket;
	let loading = false;

	let pageSettings = {
		page: data.tickets.page - 1,
		limit: data.tickets.perPage,
		size: data.tickets.totalItems ?? 0,
		amounts: [1, 5, 10, 20]
	};

	$: pageSettings.size = data.tickets.totalItems;

	function onPageChange(e) {
		filters = { ...filters, page: e.detail + 1 };
		goto(`/tickets${selectedTicket ? `/${selectedTicket.id}` : ''}/?${parseQueryParams(filters)}`);
	}

	function onAmountChange(e) {
		filters = {
			...filters,
			perPage: e.detail,
			page: e.detail * filters.page > data.tickets.totalItems ? 0 : filters.page
		};
		goto(`/tickets${selectedTicket ? `/${selectedTicket.id}` : ''}/?${parseQueryParams(filters)}`);
	}

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
				faultTypeList,
				causeCodes,
				technicians
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

	async function handleExport(exportType) {
		loading = true;
		const tickets = await getAllTickets();
		exportType(tickets);
		loading = false;
	}

	async function handleExportData() {
		handleExport(exportIncidents);
	}

	let unSubscribe;

	onMount(async () => {
		unSubscribe = await pb.collection('tickets').subscribe(
			'*',
			async (e) => {
				toastStore.trigger({
					message: `A ticket has been ${e.action}d! by ${e.record.expand.reportedBy.firstName} ${e.record.expand.reportedBy.lastName}`,
					action: {
						label: 'View',
						response: () => goto(`/tickets/${e.record.id}`)
					},
					timeout: 3000
				});

				updateTickets(e);
			},
			{
				expand
			}
		);

		unSubscribe = await pb.collection('comments').subscribe(
			'*',
			async (e) => {
				toastStore.trigger({
					message: `${e.record.expand.userId.firstName} ${e.record.expand.userId.lastName} ${e.action}d on ticket #${e.record.expand.ticketId.count}`,
					action: {
						label: 'View',
						response: () => goto(`/tickets/${e.record.ticketId}`)
					}
				});
			},
			{
				expand: 'userId, ticketId'
			}
		);
	});

	onDestroy(() => {
		unSubscribe?.();
	});
</script>

<div class="flex flex-col mt-5 w-full">
	<div class="flex justify-between items-center">
		<h1 class="h1 font-extrabold">Incidents</h1>

		<div class="flex justify-between items-center gap-4">
			<ExportButton
				bind:loading
				label="Incidents"
				{handleExportData}
				noRecords={tickets.items.length === 0}
			/>

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

	<TicketFilters {filters} {categories} {categoryLevels} />

	<div class="grid grid-cols-3 w-full gap-10 mt-4">
		<div class="col-span-2">
			<Paginator
				buttonClasses="rounded-md btn-icon variant-filled"
				bind:settings={pageSettings}
				on:page={onPageChange}
				on:amount={onAmountChange}
			/>

			<TicketCard {tickets} />
		</div>

		<div class="h3 border border-gray-300 dark:border-white/40 h-full p-5">
			<h3 class="h3 pb-5">Recent Activity</h3>
			<TicketHistory />
		</div>
	</div>
</div>
