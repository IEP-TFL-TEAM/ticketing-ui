<script>
	import { goto } from '$app/navigation';
	import { parseQueryParams } from '$lib/utils/parsers';
	import { statuses } from '$lib/utils';

	export let filters, categories, categoryLevels;

	let searchStatus = filters.status;
	let searchText = filters.title || filters.description;
	let searchCategory = filters.categoryId;
	let searchCategoryLevelId = filters.categoryLevelId;
	let filteredCategoryLevels = [];

	function handle() {
		const search = {
			...filters,
			status: searchStatus,
			title: searchText,
			description: searchText,
			categoryId: searchCategory,
			categoryLevelId: searchCategoryLevelId,
			count: searchText,
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
</script>

<div class="flex w-full gap-2 py-4 items-center border-t border-gray-300 dark:border-white/40">
	<div>
		<form on:submit|preventDefault={handle} class="w-full">
			<input
				bind:value={searchText}
				placeholder="Search title and description"
				class="input border-none text-black dark:text-inherit pr-32"
			/>
		</form>
	</div>

	<div>
		<select
			class="select border-none cursor-pointer mr-16"
			bind:value={searchStatus}
			on:change={() => handle()}
		>
			<option value={null} disabled selected>Status</option>
			{#each statuses as status}
				<option value={status}>
					{status}
				</option>
			{/each}
		</select>
	</div>

	<div>
		<select
			class="select border-none mr-8 cursor-pointer"
			bind:value={searchCategory}
			on:change={() => {
				searchCategoryLevelId = null;
				handle();
			}}
		>
			<option value={null} disabled selected>Category</option>
			{#each categories as { id, name }}
				<option value={id}>
					{name}
				</option>
			{/each}
		</select>
	</div>

	<div>
		<select
			class="select border-none mr-8 cursor-pointer"
			bind:value={searchCategoryLevelId}
			on:change={() => handle()}
		>
			<option value={null} disabled selected>Category Level</option>
			{#each filteredCategoryLevels as level}
				<option value={level.id}>
					{level.name}
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
