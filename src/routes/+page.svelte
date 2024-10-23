<script>
	import StatusCard from '$lib/components/home/StatusCard.svelte';
	import Charts from '$lib/components/home/Charts.svelte';

	export let data;
	$: ({ tickets } = data);
</script>

<svelte:head>
	<title>Welcome to the System</title>
</svelte:head>

<div class="container flex flex-col p-8 mx-auto">
	<div class="flex flex-col mt-5 gap-y-2">
		<h1 class="h1 font-extrabold">Welcome to TFL NOC Ticketing System</h1>
		<p>Navigate through the system with options on the sidebar</p>
	</div>

	<div class="flex flex-col w-full mt-8">
		<div class="flex flex-col w-full gap-10">
			<StatusCard {tickets} />
		</div>

		<Charts {data} />
	</div>
</div>
