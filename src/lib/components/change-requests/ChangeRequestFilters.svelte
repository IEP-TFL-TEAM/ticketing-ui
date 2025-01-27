<script>
	import Svelecte from 'svelecte';
	import { onMount } from 'svelte';
	import { Paginator } from '@skeletonlabs/skeleton';
	import { parseQueryParams } from '$lib/utils/parsers';
	import { goto } from '$app/navigation';
	import { IconCaretDown, IconCaretUp } from '@tabler/icons-svelte';
	import { statuses } from '$lib/utils';

	export let filters, pageSettings, regions, areas, sites, teams, staff, isFiltering;

	let searchText = null,
		filterByImpact = null,
		filterByRequestee = null,
		filterByStatus = null,
		filterByRegion = null,
		filterByArea = null,
		filterBySite = null,
		filterByTeam = null;

	let showFilters =
		filters.title ||
		filters.objective ||
		filters.ticketNumber ||
		filters.serviceImpact ||
		filters.status ||
		filters.regionId ||
		filters.areaId ||
		filters.siteId ||
		filters.teamIds ||
		filters.requestee;

	function handle() {
		isFiltering = true;
		const search = {
			...filters,
			title: searchText,
			objective: searchText,
			serviceImpact: filterByImpact,
			requestee: filterByRequestee,
			ticketNumber: searchText,
			status: filterByStatus,
			areaId: filterByArea,
			regionId: filterByRegion,
			siteId: filterBySite,
			teamIds: filterByTeam,
			page: 1
		};
		const queryParams = parseQueryParams(search);
		goto(`/change-requests/?${queryParams}`);
	}

	function reset() {
		isFiltering = false;
		searchText = null;
		filterByImpact = null;
		filterByRequestee = null;
		filterByStatus = null;
		filterByRegion = null;
		filterByArea = null;
		filterBySite = null;
		filterByTeam = null;
		goto(`/change-requests`);
	}

	function onPageChange(e) {
		filters = { ...filters, page: e.detail + 1 };
		goto(`change-requests?${parseQueryParams(filters)}`);
	}

	function onAmountChange(e) {
		filters = {
			...filters,
			perPage: e.detail,
			page: e.detail * filters.page > pageSettings.size ? 0 : filters.page
		};
		goto(`change-requests?${parseQueryParams(filters)}`);
	}

	onMount(() => {
		searchText = filters.title;
		searchText = filters.objective;
		searchText = filters.ticketNumber;
		filterByStatus = filters.status;
		filterByImpact = filters.serviceImpact;
		filterByArea = filters.areaId;
		filterByRegion = filters.regionId;
		filterBySite = filters.siteId;
		filterByTeam = filters.teamIds;
		filterByRequestee = filters.requestee;
	});

	const chipDiv = 'flex items-center gap-4 flex-wrap w-full';
</script>

<div class="flex flex-col items-start justify-between w-full mt-10 gap-y-4">
	<div class="flex items-center gap-2">
		<button
			type="button"
			on:click={() => (showFilters = !showFilters)}
			class=" border border-black/30 dark:border-white/30 p-2.5 px-8 rounded font-medium bg-white dark:bg-neutral-900 inline-flex gap-x-2"
		>
			{showFilters ? 'Hide Filters' : 'Show Filters'}
			<span>
				{#if showFilters}
					<IconCaretUp />
				{:else}
					<IconCaretDown />
				{/if}
			</span>
		</button>

		<form on:submit|preventDefault={handle}>
			<input
				type="text"
				id="simple-search"
				bind:value={searchText}
				on:change={() => handle()}
				class="w-full px-6 py-3 mr-16 text-sm bg-white border rounded border-black/30 dark:border-white/30 dark:bg-neutral-900 text-blackyyy dark:text-white placeholder:dark:text-white placeholder:text-black focus:ring-primary-500 dark:focus:ring-tertiary-500"
				placeholder="Search ..."
				required
			/>
		</form>

		<button
			type="button"
			on:click={() => reset()}
			class=" border border-black/30 dark:border-white/30 p-2.5 px-8 rounded font-medium bg-white dark:bg-neutral-900"
		>
			Reset
		</button>
	</div>
</div>

{#if showFilters}
	<div
		class="relative p-8 my-8 bg-white border rounded border-gray-20 dark:border-white/30 dark:bg-neutral-900"
	>
		<div class="flex flex-col w-full gap-3 font-medium transition-transform whitespace-nowrap">
			<div class="flex items-start gap-4">
				<h3 class="w-1/5">Status:</h3>
				<div class={chipDiv + ' relative'}>
					<Svelecte
						options={statuses}
						bind:value={filterByStatus}
						on:change={handle}
						class="!text-primary-500 dark:!text-tertiary-500"
					/>
				</div>
			</div>

			<div class="flex items-start gap-4">
				<h3 class="w-1/5">Service Impact:</h3>
				<div class={chipDiv + ' relative'}>
					<Svelecte
						options={['Yes', 'No']}
						bind:value={filterByImpact}
						on:change={handle}
						class="!text-primary-500 dark:!text-tertiary-500"
					/>
				</div>
			</div>

			<div class="flex items-start gap-4">
				<h3 class="w-1/5">Region:</h3>
				<div class={chipDiv + ' relative'}>
					<Svelecte
						options={regions}
						bind:value={filterByRegion}
						on:change={handle}
						class="!text-primary-500 dark:!text-tertiary-500"
					/>
				</div>
			</div>

			<div class="flex items-start gap-4">
				<h3 class="w-1/5">Area:</h3>
				<div class={chipDiv + ' relative'}>
					<Svelecte
						options={areas}
						bind:value={filterByArea}
						on:change={handle}
						class="!text-primary-500 dark:!text-tertiary-500"
					/>
				</div>
			</div>

			<div class="flex items-start gap-4">
				<h3 class="w-1/5">Site:</h3>
				<div class={chipDiv + ' relative'}>
					<Svelecte
						options={sites}
						bind:value={filterBySite}
						on:change={handle}
						class="!text-primary-500 dark:!text-tertiary-500"
					/>
				</div>
			</div>

			<div class="flex items-start gap-4">
				<h3 class="w-1/5">Tecnical Groups Involved:</h3>
				<div class={chipDiv + ' relative'}>
					<Svelecte
						options={teams}
						bind:value={filterByTeam}
						on:change={handle}
						class="!text-primary-500 dark:!text-tertiary-500"
					/>
				</div>
			</div>

			<div class="flex items-start gap-4">
				<h3 class="w-1/5">Requestee:</h3>
				<div class={chipDiv + ' relative'}>
					<Svelecte
						options={staff}
						bind:value={filterByRequestee}
						on:change={handle}
						class="!text-primary-500 dark:!text-tertiary-500"
					/>
				</div>
			</div>
		</div>
	</div>
{/if}

<div class="py-5">
	<Paginator
		buttonClasses="rounded-md btn-icon variant-filled"
		bind:settings={pageSettings}
		on:page={onPageChange}
		on:amount={onAmountChange}
		select="bg-white dark:bg-[#252424] rounded-sm border"
	/>
</div>
