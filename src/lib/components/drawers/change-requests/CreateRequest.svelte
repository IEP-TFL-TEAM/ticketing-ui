<script>
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import CRStep1 from './CRStep1.svelte';
	import CRStep2 from './CRStep2.svelte';
	import CRStep3 from './CRStep3.svelte';

	let staffId = null,
		teamIds = [],
		teamEmails = [],
		cteamId = null,
		siteId = null,
		regionId = null,
		areaId = null,
		selectedStaff = null,
		selectedArea = null,
		selectedSite = null;

	let onCompleteHandler;
</script>

<div class="w-full p-5">
	<Stepper on:complete={onCompleteHandler}>
		<Step locked={teamIds.length === 0}>
			<svelte:fragment slot="header">Select Requestee</svelte:fragment>
			<CRStep1 bind:staffId bind:teamIds bind:teamEmails bind:cteamId bind:selectedStaff />
		</Step>

		<Step locked={!(regionId && selectedArea && selectedSite)}>
			<svelte:fragment slot="header">Select Region</svelte:fragment>
			<CRStep2 bind:regionId bind:areaId bind:siteId bind:selectedArea bind:selectedSite />
		</Step>

		<Step>
			<svelte:fragment slot="header">Change Request Details</svelte:fragment>
			<CRStep3
				{staffId}
				{teamIds}
				{teamEmails}
				{cteamId}
				{siteId}
				{regionId}
				{areaId}
				bind:onCompleteHandler
			/>
		</Step>
	</Stepper>
</div>
