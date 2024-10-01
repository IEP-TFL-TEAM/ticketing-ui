<script>
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import SelectTeamAndCategory from './SelectTeamAndCategory.svelte';
	import SelectDetails from './SelectDetails.svelte';
	import SelectRegionAndArea from './SelectRegionAndArea.svelte';

	let teamIds = [],
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
		<Step locked={!(teamIds.length > 0 && catId && selectedCatLevel && equipIds.length > 0)}>
			<svelte:fragment slot="header">Select Team(s)</svelte:fragment>
			<SelectTeamAndCategory
				bind:teamIds
				bind:catId
				bind:catLevelId
				bind:selectedCatLevel
				bind:equipIds
			/>
		</Step>

		<Step locked={!(regionId && selectedArea && selectedSite)}>
			<svelte:fragment slot="header">Select Region</svelte:fragment>
			<SelectRegionAndArea
				bind:regionId
				bind:areaId
				bind:siteId
				bind:selectedArea
				bind:selectedSite
			/>
		</Step>

		<Step>
			<svelte:fragment slot="header">Ticket Details</svelte:fragment>
			<SelectDetails
				{teamIds}
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
