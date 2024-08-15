<script>
	import StatusCard from '$lib/components/home/StatusCard.svelte';

	export let data;
</script>

<div class="container flex flex-col mx-auto gap-2 mt-5">
	<h1 class="h1 font-extrabold">Welcome to TFL NOC Ticketing System</h1>
	<p class="p text-xl mb-8">Get the world at your fingertips</p>

	<StatusCard {data} />
</div>
