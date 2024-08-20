<script>
	import { IconPlus, IconFilter } from '@tabler/icons-svelte';

	// export let data;

	let showFilters = true;
</script>

<div class="flex flex-col mt-5 w-full">
	<div class="flex justify-between items-center mb-8">
		<div class="flex flex-col">
			<h1 class="h1 font-extrabold">Recipients Management</h1>

			<p class="p text-xl">Manage Recipients that will receive emails upon incident actions</p>
		</div>

		<div class="flex justify-between items-center gap-4">
			<button type="button" class="btn rounded-none variant-outline-primary" on:click={() => {}}>
				<IconFilter size={20} />
				<span>
					{showFilters ? 'Hide Filters' : 'Show Filters'}
				</span>
			</button>

			<button type="button" class="btn rounded-none variant-filled-primary" on:click={() => {}}>
				<IconPlus size={20} />
				<span> New Application </span>
			</button>
		</div>
	</div>
</div>
