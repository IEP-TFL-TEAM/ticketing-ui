<script>
	import { goto } from '$app/navigation';
	import { parseQueryParams } from '$lib/utils/parsers';
	import { statuses } from '$lib/utils';
	import { IconCaretUp, IconCaretDown } from '@tabler/icons-svelte';

	export let filters, categories, categoryLevels;

	let searchStatus = filters.status;
	let searchText = filters.title || filters.description;
	let searchCategory = filters.categoryId;
	let searchCategoryLevelId = filters.categoryLevelId;
	let filteredCategoryLevels = [];
	let showFilters = false;

	function handle() {
		const search = {
			...filters,
			status: searchStatus,
			title: searchText,
			description: searchText,
			categoryId: searchCategory,
			categoryLevelId: searchCategoryLevelId,
			ticketNumber: searchText,
			page: 1
		};
		const queryParams = parseQueryParams(search);
		goto(`/tickets/?${queryParams}`);
	}

	function reset() {
		searchStatus = null;
		searchText = null;
		searchCategory = null;
		searchCategoryLevelId = null;
		goto(`/tickets`);
	}

	$: {
		if (!searchCategory) filteredCategoryLevels = categoryLevels;
		else {
			filteredCategoryLevels = categoryLevels
				.filter((level) => level.categoryId === searchCategory)
				.map((level) => ({
					name: level.name,
					id: level.id
				}));
		}
	}

	const chipStyles =
		'btn variant-outline-primary dark:variant-outline-tertiary whitespace-nowrap rounded hover:variant-soft-primary dark:hover:variant-soft-tertiary';
	const chipDiv = ' flex items-center gap-4 flex-wrap w-full';
	const active = 'variant-filled-primary dark:variant-filled-tertiary';
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
					{#each statuses as status}
						<button
							type="button"
							class="{chipStyles} capitalize {searchStatus === status ? ` ${active}` : ''}"
							on:click={() => {
								searchStatus = status;
								handle();
							}}
						>
							{status}
						</button>
					{/each}
				</div>
			</div>

			<div class="flex items-start gap-4">
				<h3 class="w-1/5">Category:</h3>
				<div class={chipDiv + ' relative'}>
					{#each categories as { id, name }}
						<button
							type="button"
							class="{chipStyles} capitalize {searchCategory === id ? ` ${active}` : ''}"
							on:click={() => {
								searchCategory = id;
								searchCategoryLevelId = null;
								handle();
							}}
						>
							{name}
						</button>
					{/each}
				</div>
			</div>

			<div class="flex items-start gap-4">
				<h3 class="w-1/5">Severity:</h3>
				<div class={chipDiv + ' relative'}>
					{#each filteredCategoryLevels as { id, name }}
						<button
							type="button"
							class="{chipStyles} capitalize {searchCategoryLevelId === id ? ` ${active}` : ''}"
							on:click={() => {
								searchCategoryLevelId = id;
								handle();
							}}
						>
							{name}
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}
