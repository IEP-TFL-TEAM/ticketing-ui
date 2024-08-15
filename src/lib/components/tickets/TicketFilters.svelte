<script>
	import { goto } from '$app/navigation';
	import { parseQueryParams } from '$lib/utils/parsers';
	import { statuses } from '$lib/utils';

	export let filters, categories, categoryLevels;

	let searchStatus = filters.status;
	let searchText = filters.title || filters.description;
	let searchCategory = filters.categoryId;
	let searchCategoryLevelId = filters.categoryLevelId;

	function handle() {
		const search = {
			...filters,
			status: searchStatus,
			title: searchText,
			description: searchText,
			categoryId: searchCategory,
			categoryLevelId: searchCategoryLevelId,
			count: searchText,
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
</script>

<div class="flex w-full gap-2 py-4 items-center border-t border-gray-300 dark:border-white/40">
	<div>
		<form on:submit|preventDefault={handle} class="w-full">
			<input
				bind:value={searchText}
				placeholder="🔍 Search Tickets"
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
			on:change={() => handle()}
		>
			<option value={null} disabled selected>Category</option>
			{#each categories as category}
				<option value={category.id}>
					{category.name}
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
			{#each categoryLevels as level}
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
