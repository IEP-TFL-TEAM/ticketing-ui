<script>
	import StatusCard from '$lib/components/home/StatusCard.svelte';

	export let data;
</script>

<div class="container flex flex-col mx-auto gap-4">
	<h2
		class="mt-16 font-extrabold tracking-wide text-center text-primary-500 dark:text-tertiary-500 h2 uppercase"
	>
		Welcome to the TFL NOC Ticketing System
	</h2>
	<h4 class="font-semibold text-center h4 uppercase">Get the world at your fingertips</h4>

	<StatusCard {data} />
</div>
