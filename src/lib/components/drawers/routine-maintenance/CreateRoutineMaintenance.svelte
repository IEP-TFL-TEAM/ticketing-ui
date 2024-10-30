<script>
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import RMStep1 from './RMStep1.svelte';
	import RMStep2 from './RMStep2.svelte';
	import RMStep3 from './RMStep3.svelte';

	let staffId = null,
		teamIds = [],
		maintenanceTeamId = null,
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
			<RMStep1 bind:staffId bind:teamIds bind:maintenanceTeamId bind:siteId bind:selectedStaff />
		</Step>

		<Step locked={!(regionId && selectedArea && selectedSite)}>
			<svelte:fragment slot="header">Select Region</svelte:fragment>
			<RMStep2 bind:regionId bind:areaId bind:siteId bind:selectedArea bind:selectedSite />
		</Step>

		<Step>
			<svelte:fragment slot="header">Routine Maintenance Details</svelte:fragment>
			<RMStep3
				{staffId}
				{teamIds}
				{maintenanceTeamId}
				{siteId}
				{regionId}
				{areaId}
				bind:onCompleteHandler
			/>
		</Step>
	</Stepper>
</div>
