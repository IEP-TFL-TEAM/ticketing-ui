<script>
	import { Paginator } from '@skeletonlabs/skeleton';
	import { parseQueryParams } from '$lib/utils/parsers';
	import { goto } from '$app/navigation';
	import { IconCaretDown, IconCaretUp } from '@tabler/icons-svelte';

	export let filters, pageSettings, requestees;

	let searchText = filters.title || filters.objective;
	let searchImpact = filters.serviceImpact;
	let searchAwareness = filters.awarenessToBeMade;
	let searchRequestee = filters.requestee;
	let showFilters = false;

	function handle() {
		const search = {
			...filters,
			title: searchText,
			objective: searchText,
			serviceImpact: searchImpact,
			awarenessToBeMade: searchAwareness,
			requestee: searchRequestee,
			ticketNumber: searchText,
			page: 1
		};
		const queryParams = parseQueryParams(search);
		goto(`/change-requests/?${queryParams}`);
	}

	function reset() {
		searchText = null;
		searchImpact = null;
		searchAwareness = null;
		searchRequestee = null;
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
				<h3 class="w-1/5">Service Impact:</h3>
				<div class={chipDiv + ' relative'}>
					{#each ['Yes', 'No'] as item}
						<button
							type="button"
							class="{chipStyles} capitalize {searchImpact === item ? ` ${active}` : ''}"
							on:click={() => {
								searchImpact = item;
								handle();
							}}
						>
							{item}
						</button>
					{/each}
				</div>
			</div>

			<div class="flex items-start gap-4">
				<h3 class="w-1/5">Awareness To Be Made:</h3>
				<div class={chipDiv + ' relative'}>
					{#each ['No', 'Internal', 'External', 'Media'] as item}
						<button
							type="button"
							class="{chipStyles} capitalize {searchAwareness === item ? ` ${active}` : ''}"
							on:click={() => {
								searchAwareness = item;
								handle();
							}}
						>
							{item}
						</button>
					{/each}
				</div>
			</div>

			<div class="flex items-start gap-4">
				<h3 class="w-1/5">Requestee:</h3>
				<div class={chipDiv + ' relative'}>
					<select
						class="select border-none mr-8 cursor-pointer"
						bind:value={searchRequestee}
						on:change={() => handle()}
					>
						<option value={null} disabled selected>Requestee List</option>
						{#each requestees as item}
							<option value={item.id}>
								{item.name}
							</option>
						{/each}
					</select>
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
	/>
</div>
