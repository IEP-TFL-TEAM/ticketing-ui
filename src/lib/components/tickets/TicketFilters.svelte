<script>
	import Svelecte from 'svelecte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { parseQueryParams } from '$lib/utils/parsers';

	import { getFaultList } from '$lib/api/faultTypes';
	import { getTeams } from '$lib/api/teams';
	import { getRegionList } from '$lib/api/region';
	import { getAreaList } from '$lib/api/area';
	import { getSiteList } from '$lib/api/sites';
	import { getCauseCodes } from '$lib/api/causeCodes';
	import { getSolutionCodes } from '$lib/api/solutionCodes';

	import { IconCaretUp, IconCaretDown } from '@tabler/icons-svelte';

	export let filters, isFiltering;

	let faultTypeList = [],
		teams = [],
		regions = [],
		areas = [],
		sites = [],
		causeCodes = [],
		solutionCodes = [];

	onMount(async () => {
		searchText = filters.title;
		searchText = filters.description;
		searchText = filters.ticketNumber;
		filterByArea = filters.areaId;
		filterByRegion = filters.regionId;
		filterBySite = filters.siteId;
		filterByFaultType = filters.faultTypeId;
		filterByCause = filters.cause;
		filterBySolution = filters.solution;
		filterByTeam = filters.teamIds;
		filterByDepartment = filters.departmentIds;

		const results = await Promise.allSettled([
			getFaultList(),
			getTeams(),
			getRegionList(),
			getAreaList(),
			getSiteList(),
			getCauseCodes(),
			getSolutionCodes()
		]);

		[faultTypeList, teams, regions, areas, sites, causeCodes, solutionCodes] = results.map(
			({ status, value }) => (status === 'fulfilled' ? value : [])
		);

		// Sort alphabetically by name
		faultTypeList = faultTypeList.sort((a, b) => a.name.localeCompare(b.name));
		teams = teams.sort((a, b) => a.name.localeCompare(b.name));
		regions = regions.sort((a, b) => a.name.localeCompare(b.name));
		areas = areas.sort((a, b) => a.name.localeCompare(b.name));
		sites = sites.sort((a, b) => a.name.localeCompare(b.name));
		causeCodes = causeCodes.sort((a, b) => a.name.localeCompare(b.name));
		solutionCodes = solutionCodes.sort((a, b) => a.name.localeCompare(b.name));
	});

	let searchText = null,
		filterByRegion = null,
		filterByArea = null,
		filterBySite = null,
		filterByFaultType = null,
		filterByCause = null,
		filterBySolution = null,
		filterByDepartment = null,
		filterByTeam = null;

	$: showFilters =
		filters.regionId ||
		filters.areaId ||
		filters.faultTypeId ||
		filters.cause ||
		filters.solution ||
		filters.siteId ||
		filters.departmentIds ||
		filters.teamIds;

	function handle() {
		isFiltering = true;
		const search = {
			...filters,
			title: searchText,
			description: searchText,
			ticketNumber: searchText,
			areaId: filterByArea,
			regionId: filterByRegion,
			siteId: filterBySite,
			faultTypeId: filterByFaultType,
			cause: filterByCause,
			solution: filterBySolution,
			teamIds: filterByTeam,
			departmentIds: filterByDepartment,
			page: 1
		};
		const queryParams = parseQueryParams(search);
		goto(`/tickets/?${queryParams}`);
	}

	function reset() {
		isFiltering = false;
		searchText = null;
		filterByRegion = null;
		filterByArea = null;
		filterBySite = null;
		filterByFaultType = null;
		filterByCause = null;
		filterBySolution = null;
		filterByTeam = null;
		filterByDepartment = null;
		goto(`/tickets`);
	}

	const chipDiv = 'flex items-center gap-4 flex-wrap w-full';
</script>

<div class="flex flex-col items-start justify-between w-full mt-10 gap-y-4">
	<div class="flex items-center gap-2">
		<button
			type="button"
			on:click={() => (showFilters = !showFilters)}
			class=" border border-black/30 dark:border-white/30 p-2.5 px-8 rounded font-medium bg-white dark:bg-neutral-900 inline-flex gap-x-2"
		>
			{showFilters ? 'Hide Filters' : 'Show More Filters'}
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
				<h3 class="w-1/5">Fault Types:</h3>
				<div class={chipDiv + ' relative'}>
					<Svelecte
						options={faultTypeList}
						bind:value={filterByFaultType}
						on:change={handle}
						class="!text-primary-500 dark:!text-tertiary-500"
					/>
				</div>
			</div>

			<div class="flex items-start gap-4">
				<h3 class="w-1/5">Cause Codes:</h3>
				<div class={chipDiv + ' relative'}>
					<Svelecte
						options={causeCodes}
						bind:value={filterByCause}
						on:change={handle}
						class="!text-primary-500 dark:!text-tertiary-500"
					/>
				</div>
			</div>

			<div class="flex items-start gap-4">
				<h3 class="w-1/5">Solution Codes:</h3>
				<div class={chipDiv + ' relative'}>
					<Svelecte
						options={solutionCodes}
						bind:value={filterBySolution}
						on:change={handle}
						class="!text-primary-500 dark:!text-tertiary-500"
					/>
				</div>
			</div>

			<div class="flex items-start gap-4">
				<h3 class="w-1/5">Department Involved:</h3>
				<div class={chipDiv + ' relative'}>
					<Svelecte
						options={teams}
						bind:value={filterByDepartment}
						on:change={handle}
						class="!text-primary-500 dark:!text-tertiary-500"
					/>
				</div>
			</div>

			<div class="flex items-start gap-4">
				<h3 class="w-1/5">Team Assigned:</h3>
				<div class={chipDiv + ' relative'}>
					<Svelecte
						options={teams}
						bind:value={filterByTeam}
						on:change={handle}
						class="!text-primary-500 dark:!text-tertiary-500"
					/>
				</div>
			</div>
		</div>
	</div>
{/if}
