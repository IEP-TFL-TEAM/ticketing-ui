<script>
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	import StatusCard from '$lib/components/home/StatusCard.svelte';
	import IncidentCharts from '$lib/components/home/IncidentCharts.svelte';
	import RequestCharts from '$lib/components/home/RequestCharts.svelte';
	import RoutineCharts from '$lib/components/home/RoutineCharts.svelte';

	export let data;
	$: ({ tickets, requests, routines } = data);

	let tab = 'Incidents';
</script>

<svelte:head>
	<title>Welcome to the System</title>
</svelte:head>

<div class="container flex flex-col mx-auto">
	<div class="flex flex-col mt-5 gap-y-2">
		<h1 class="h1 font-extrabold">Welcome to TFL NOC Ticketing System</h1>
		<p>Navigate through the system with options on the sidebar</p>
	</div>

	<div class="mt-4 2xl:w-1/2 w-full">
		<RadioGroup rounded="rounded-none" background="bg-white dark:bg-[#252424]">
			{#each ['Incidents', 'Change Requests', 'Routine Maintenance'] as item}
				<RadioItem bind:group={tab} name="justify" value={item}>{item}</RadioItem>
			{/each}
		</RadioGroup>
	</div>

	<div class="flex flex-col w-full mt-8">
		{#if tab === 'Incidents'}
			<div class="flex flex-col w-full gap-10">
				<StatusCard records={tickets} title="Incidents" />
			</div>

			<IncidentCharts {data} />
		{:else if tab === 'Change Requests'}
			<div class="flex flex-col w-full gap-10">
				<StatusCard records={requests} title="Change Requests" />
			</div>

			<RequestCharts {data} />
		{:else if tab === 'Routine Maintenance'}
			<div class="flex flex-col w-full gap-10">
				<StatusCard records={routines} title="Routine Maintenance" />
			</div>

			<RoutineCharts {data} />
		{/if}
	</div>
</div>
