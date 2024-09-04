<script>
	import { IconFileSpreadsheet, IconRotateClockwise2 } from '@tabler/icons-svelte';

	export let label, loading, handleExportData, noRecords;
</script>

<button
	on:click={() => handleExportData()}
	type="button"
	class="font-medium btn variant-filled rounded-none"
	disabled={noRecords || loading}
>
	{#if loading}
		<IconRotateClockwise2 class="animate-spin" />
	{:else}
		<IconFileSpreadsheet />
	{/if}
	<span class="hidden md:inline-block"> Export {label}</span>
</button>
