<script>
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import CRStep1 from './CRStep1.svelte';
	import CRStep2 from './CRStep2.svelte';

	let staffId = null,
		teamIds = [],
		cteamId = null,
		siteId = null,
		selectedStaff = null,
		selectedCTeam = null,
		selectedSite = null;

	let onCompleteHandler;
</script>

<div class="w-full p-5">
	<Stepper on:complete={onCompleteHandler}>
		<Step locked={!(staffId && cteamId && siteId && teamIds.length > 0)}>
			<svelte:fragment slot="header">Select Requestee</svelte:fragment>
			<CRStep1
				bind:staffId
				bind:teamIds
				bind:cteamId
				bind:siteId
				bind:selectedStaff
				bind:selectedCTeam
				bind:selectedSite
			/>
		</Step>

		<Step>
			<svelte:fragment slot="header">Change Request Details</svelte:fragment>
			<CRStep2 {staffId} {teamIds} {cteamId} {siteId} bind:onCompleteHandler />
		</Step>
	</Stepper>
</div>
