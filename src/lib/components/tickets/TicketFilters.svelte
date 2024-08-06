<script>
	import { goto } from '$app/navigation';
	import { parseQueryParams } from '$lib/utils/parsers';
	import { statuses, severityLevels } from '$lib/utils';
	import { IconSearch } from '@tabler/icons-svelte';

	export let filters, showFilters;

	let searchStatus = filters.status;
	let searchText = filters.title || filters.description;
	let searchSeverity = filters.severity;

	function handle() {
		const search = {
			...filters,
			status: searchStatus,
			severity: searchSeverity,
			title: searchText,
			description: searchText,
			count: searchText,
			page: 1
		};
		const queryParams = parseQueryParams(search);
		goto(`/tickets/?${queryParams}`);
	}

	function reset() {
		searchStatus = null;
		searchText = null;
		searchSeverity = null;
		goto(`/tickets`);
	}
</script>

{#if showFilters}
	<div class="flex w-full gap-2 py-4 items-center border-t border-gray-300">
		<div class="w-1/2">
			<form on:submit|preventDefault={handle} class="w-full">
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim"><IconSearch /></div>
					<input placeholder="Search Tickets" bind:value={searchText} />
				</div>
			</form>
		</div>

		<div>
			<select
				class="select border-none cursor-pointer"
				bind:value={searchStatus}
				on:change={() => handle()}
			>
				<option value={null} disabled selected>Status</option>
				{#each statuses as status}
					<option value={status}>
						{status.charAt(0) + status.substring(1).toLowerCase()}
					</option>
				{/each}
			</select>
		</div>

		<div>
			<select
				class="select border-none mr-8 cursor-pointer"
				bind:value={searchSeverity}
				on:change={() => handle()}
			>
				<option value={null} disabled selected>Severity</option>
				{#each severityLevels as level}
					<option value={level}>
						{level.charAt(0) + level.substring(1).toLowerCase()}
					</option>
				{/each}
			</select>
		</div>

		<div>
			<button type="button" on:click={() => reset()} class="btn variant-filled-primary">
				Reset
			</button>
		</div>
	</div>
{/if}
