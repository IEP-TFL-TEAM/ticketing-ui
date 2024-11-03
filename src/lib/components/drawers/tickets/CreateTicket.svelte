<script>
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import TStep1 from './TStep1.svelte';
	import TStep2 from './TStep2.svelte';
	import TStep3 from './TStep3.svelte';

	let teamIds = [],
		departmentIds = [],
		teamEmails = [],
		catId = null,
		catLevelId = null,
		equipIds = [],
		selectedCatLevel = null;

	let regionId = null,
		areaId = null,
		siteId = null,
		selectedArea = null,
		selectedSite = null;

	let onCompleteHandler;
</script>

<div class="w-full p-5">
	<Stepper on:complete={onCompleteHandler}>
		<Step
			locked={!(
				teamIds.length > 0 &&
				catId &&
				selectedCatLevel &&
				equipIds.length > 0 &&
				departmentIds.length > 0
			)}
		>
			<svelte:fragment slot="header">Select Severity Category & Severity Level</svelte:fragment>
			<TStep1
				bind:teamIds
				bind:departmentIds
				bind:teamEmails
				bind:catId
				bind:catLevelId
				bind:selectedCatLevel
				bind:equipIds
			/>
		</Step>

		<Step locked={!(regionId && selectedArea && selectedSite)}>
			<svelte:fragment slot="header">Select Region</svelte:fragment>
			<TStep2 bind:regionId bind:areaId bind:siteId bind:selectedArea bind:selectedSite />
		</Step>

		<Step>
			<svelte:fragment slot="header">Ticket Details</svelte:fragment>
			<TStep3
				{teamIds}
				{departmentIds}
				{teamEmails}
				{catId}
				{catLevelId}
				{equipIds}
				{regionId}
				{areaId}
				{siteId}
				bind:onCompleteHandler
			/>
		</Step>
	</Stepper>
</div>
