<script>
	import StatusCard from '$lib/components/home/StatusCard.svelte';
	import IncidentCharts from '$lib/components/home/IncidentCharts.svelte';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	export let data;
	$: ({ tickets, requests, routines } = data);

	let value = 'Incidents';
</script>

<svelte:head>
	<title>Welcome to the System</title>
</svelte:head>

<div class="container flex flex-col p-8 mx-auto">
	<div class="flex flex-col mt-5 gap-y-2">
		<h1 class="h1 font-extrabold">Welcome to TFL NOC Ticketing System</h1>
		<p>Navigate through the system with options on the sidebar</p>
	</div>

	<div class="mt-4 2xl:w-1/2 w-full">
		<RadioGroup rounded="rounded-none">
			{#each ['Incidents', 'Change Requests', 'Routine Maintenance'] as item}
				<RadioItem bind:group={value} name="justify" value={item}>{item}</RadioItem>
			{/each}
		</RadioGroup>
	</div>

	<div class="flex flex-col w-full mt-8">
		{#if value === 'Incidents'}
			<div class="flex flex-col w-full gap-10">
				<StatusCard records={tickets} title="Incidents" />
			</div>

			<!-- <IncidentCharts {data} /> -->
		{:else if value === 'Change Requests'}
			<div class="flex flex-col w-full gap-10">
				<StatusCard records={requests} title="Change Requests" />
			</div>
		{:else if value === 'Routine Maintenance'}
			<div class="flex flex-col w-full gap-10">
				<StatusCard records={routines} title="Routine Maintenance" />
			</div>
		{/if}
	</div>
</div>
