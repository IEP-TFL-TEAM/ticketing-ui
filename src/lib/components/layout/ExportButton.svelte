<script>
	import { IconDownload, IconRotateClockwise2 } from '@tabler/icons-svelte';

	export let label, loading, handleExportData, noTickets;
</script>

<button
	on:click={() => handleExportData()}
	type="button"
	class="font-medium btn variant-filled rounded-none"
	disabled={noTickets || loading}
>
	{#if loading}
		<IconRotateClockwise2 class="animate-spin" />
	{:else}
		<IconDownload />
	{/if}
	<span class="hidden md:inline-block"> Export {label}</span>
</button>
