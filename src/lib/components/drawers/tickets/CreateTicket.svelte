<script>
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import SelectTeamAndCategory from './SelectTeamAndCategory.svelte';
	import SelectDetails from './SelectDetails.svelte';
	import SelectRegionAndArea from './SelectRegionAndArea.svelte';

	let teamId = null,
		catId = null,
		catLevelId = null,
		equipId = null,
		selectedTeam = null,
		selectedCatLevel = null,
		selectedEquipment = null;

	let regionId = null,
		areaId = null,
		siteId = null,
		selectedArea = null,
		selectedSite = null;

	let onCompleteHandler;
</script>

<div class="w-full p-5">
	<Stepper on:complete={onCompleteHandler}>
		<Step locked={!(selectedTeam && catId && selectedCatLevel && selectedEquipment)}>
			<svelte:fragment slot="header">Select Team</svelte:fragment>
			<SelectTeamAndCategory
				bind:teamId
				bind:selectedTeam
				bind:catId
				bind:catLevelId
				bind:selectedCatLevel
				bind:equipId
				bind:selectedEquipment
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
				{teamId}
				{catId}
				{catLevelId}
				{equipId}
				{regionId}
				{areaId}
				{siteId}
				bind:onCompleteHandler
			/>
		</Step>
	</Stepper>
</div>
