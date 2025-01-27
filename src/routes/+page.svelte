<script>
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	let tabIdx = 0;
	const tabs = ['Incidents', 'Change Requests', 'Planned / Routine Maintenance'];

	// Local dev environment
	const tabMapToAnalytics = {
		0: 'http://localhost:3000/public/dashboard/c1e8bd97-4ed8-4133-beae-7b19d7d7f4de',
		1: 'http://localhost:3000/public/dashboard/f81e0674-fa83-4791-9902-8abe83c1d6f2',
		2: 'http://localhost:3000/public/dashboard/5be6fd29-7f86-4d1b-95aa-8a4fba563548'
	};

	const tabMapToTitle = {
		0: 'Incidents',
		1: 'Change Requests',
		2: 'Planned / Routine Maintenance'
	};
</script>

<div class="container flex flex-col mx-auto">
	<div class="flex flex-col mt-5 gap-y-2">
		<h1 class="h1 font-extrabold">Welcome to the TFL NOC Ticketing System</h1>
		<p>Navigate through the system with options on the sidebar</p>
	</div>

	<RadioGroup class="mt-4 w-1/2" background="bg-none">
		{#each tabs as tab, idx}
			<RadioItem bind:group={tabIdx} name={tab} value={idx}>
				<span>{tab}</span>
			</RadioItem>
		{/each}
	</RadioGroup>

	<div class="p-0.5 mt-4">
		<div class="flex w-full h-[3000px]">
			<iframe
				title={`${tabMapToTitle[tabIdx]} Dashboard`}
				src={tabMapToAnalytics[tabIdx]}
				frameborder="0"
				allowtransparency
				class="flex-grow h-full"
			/>
		</div>
	</div>
</div>
