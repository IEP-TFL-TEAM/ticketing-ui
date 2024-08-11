<script>
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import SelectTeamAndCategory from './SelectTeamAndCategory.svelte';
	import SelectDetails from './SelectDetails.svelte';
	import SelectRegionAndArea from './SelectRegionAndArea.svelte';

	let selectedTeamId = null,
		selectedCategoryId = null,
		selectedCategoryLevelId = null,
		selectedEquipmentId = null;

	let selectedRegionId = null,
		selectedAreaId = null,
		selectedSiteId = null;

	let onCompleteHandler;
	let isValid = false;
</script>

<div class="w-full p-5">
	<Stepper on:complete={onCompleteHandler}>
		<Step
			locked={!(
				selectedTeamId &&
				selectedCategoryId &&
				selectedCategoryLevelId &&
				selectedEquipmentId
			)}
		>
			<svelte:fragment slot="header">Select Team</svelte:fragment>
			<SelectTeamAndCategory
				bind:selectedTeamId
				bind:selectedCategoryId
				bind:selectedCategoryLevelId
				bind:selectedEquipmentId
			/>
		</Step>

		<Step locked={!(selectedRegionId && selectedAreaId && selectedSiteId)}>
			<svelte:fragment slot="header">Select Region</svelte:fragment>
			<SelectRegionAndArea bind:selectedRegionId bind:selectedAreaId bind:selectedSiteId />
		</Step>

		<Step locked={!isValid}>
			<svelte:fragment slot="header">Ticket Details</svelte:fragment>
			<SelectDetails
				{selectedTeamId}
				{selectedCategoryId}
				{selectedCategoryLevelId}
				{selectedEquipmentId}
				{selectedRegionId}
				{selectedAreaId}
				{selectedSiteId}
				bind:completeStepper={onCompleteHandler}
				bind:isValid
			/>
		</Step>
	</Stepper>
</div>
