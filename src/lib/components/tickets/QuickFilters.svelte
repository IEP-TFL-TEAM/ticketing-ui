<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { parseQueryParams } from '$lib/utils/parsers';
	import { statuses } from '$lib/utils';

	import { getCategories } from '$lib/api/categories';
	import { getCategoryLevels } from '$lib/api/categoryLevels';
	import { IconCheck } from '@tabler/icons-svelte';

	export let filters, isFiltering;

	let categories = [],
		categoryLevels = [];

	onMount(async () => {
		filterByStatus = filters.status;
		filterByCategory = filters.categoryId;
		filterBySeverity = filters.categoryLevelId;

		const results = await Promise.allSettled([getCategories(), getCategoryLevels()]);

		[categories, categoryLevels] = results.map((result) =>
			result.status === 'fulfilled' ? result.value : []
		);

		// Sort alphabetically by name
		categories = categories.sort((a, b) => a.name.localeCompare(b.name));
		categoryLevels = categoryLevels.sort((a, b) => a.name.localeCompare(b.name));
	});

	let filteredCategoryLevels = [];

	let filterByStatus = null,
		filterByCategory = null,
		filterBySeverity = null;

	function handle() {
		isFiltering = true;
		const search = {
			...filters,
			status: filterByStatus,
			categoryId: filterByCategory,
			categoryLevelId: filterBySeverity,
			page: 1
		};
		const queryParams = parseQueryParams(search);
		goto(`/tickets/?${queryParams}`);
	}

	$: {
		if (!filterByCategory) filteredCategoryLevels = categoryLevels;
		else {
			filteredCategoryLevels = categoryLevels
				.filter(({ categoryId }) => categoryId === filterByCategory)
				.map(({ id, name }) => ({
					id,
					name
				}));
		}

		if (!isFiltering) {
			filterByStatus = null;
			filterByCategory = null;
			filterBySeverity = null;
		}
	}

	const active = 'bg-green-500 dark:bg-green-400 dark:text-black';
</script>

<div class="mb-8 -mt-4 flex flex-wrap gap-2">
	{#each statuses as status}
		<button
			type="button"
			class={`chip ${filterByStatus === status ? `${active}` : 'variant-soft hover:variant-filled'}`}
			on:click={() => {
				filterByStatus = status;
				handle();
			}}
		>
			{#if filterByStatus === status}
				<span><IconCheck size={15} /></span>
			{/if}
			<span>{status}</span>
		</button>
	{/each}

	{#each categories as { id, name }}
		<button
			type="button"
			class={`chip ${filterByCategory === id ? `${active}` : 'variant-soft hover:variant-filled'}`}
			on:click={() => {
				filterByCategory = id;
				filterBySeverity = null;
				handle();
			}}
		>
			{#if filterByCategory === id}
				<span><IconCheck size={15} /></span>
			{/if}
			<span>{name}</span>
		</button>
	{/each}

	{#each filteredCategoryLevels as { id, name }}
		<button
			type="button"
			class={`chip ${filterBySeverity === id ? `${active}` : 'variant-soft hover:variant-filled'}`}
			on:click={() => {
				filterBySeverity = id;
				handle();
			}}
		>
			{#if filterBySeverity === id}
				<span><IconCheck size={15} /></span>
			{/if}
			<span>{name}</span>
		</button>
	{/each}
</div>
