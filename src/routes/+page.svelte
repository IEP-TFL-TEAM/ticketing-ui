<script>
	import StatusCard from '$lib/components/home/StatusCard.svelte';

	export let data;
</script>

<svelte:head>
	<title>Welcome to the System</title>
</svelte:head>

<div class="container flex flex-col p-8 mx-auto">
	<div
		class="mt-5 flex flex-col justify-between items-center gap-4 w-full p-6 bg-white border rounded-md shadow-md dark:border-gray-700 dark:bg-neutral-800"
	>
		<h2
			class="text-3xl font-extrabold tracking-wide text-center uppercase text-primary-500 dark:text-tertiary-500"
		>
			Welcome to the TFL NOC Ticketing Portal
		</h2>

		<h4 class="font-semibold">Get the world at your fingertips</h4>
	</div>

	<div class="flex flex-col w-full mt-8">
		<div class="flex flex-col w-full gap-10">
			<StatusCard {data} />
		</div>
	</div>
</div>
