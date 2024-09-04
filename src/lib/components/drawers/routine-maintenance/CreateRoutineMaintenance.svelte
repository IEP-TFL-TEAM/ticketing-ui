<script>
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import RMStep1 from './RMStep1.svelte';
	import RMStep2 from './RMStep2.svelte';

	let staffId = null,
		teamIds = [],
		maintenanceTeamId = null,
		siteId = null,
		selectedStaff = null,
		selectedMTeam = null,
		selectedSite = null;

	let onCompleteHandler;
</script>

<div class="w-full p-5">
	<Stepper on:complete={onCompleteHandler}>
		<Step locked={!(staffId && maintenanceTeamId && siteId && teamIds.length > 0)}>
			<svelte:fragment slot="header">Select Requestee</svelte:fragment>
			<RMStep1
				bind:staffId
				bind:teamIds
				bind:maintenanceTeamId
				bind:siteId
				bind:selectedStaff
				bind:selectedMTeam
				bind:selectedSite
			/>
		</Step>

		<Step>
			<svelte:fragment slot="header">Change Request Details</svelte:fragment>
			<RMStep2 {staffId} {teamIds} {maintenanceTeamId} {siteId} bind:onCompleteHandler />
		</Step>
	</Stepper>
</div>
