<script>
	import { Stepper, Step, getDrawerStore } from '@skeletonlabs/skeleton';
	import RMStep1 from './RMStep1.svelte';
	import RMStep2 from './RMStep2.svelte';
	import RMStep3 from './RMStep3.svelte';

	const drawerStore = getDrawerStore();

	let staffId = null,
		teamIds = [],
		teamEmails = [],
		maintenanceTeamId = null,
		siteId = null,
		regionId = null,
		areaId = null,
		selectedStaff = null,
		selectedArea = null,
		selectedSite = null;

	let onCompleteHandler;
</script>

<div class="relative min-h-screen lg:flex bg-white/70 dark:bg-[#252424]">
	<div class="lg:flex hidden">
		<button
			type="button"
			class="btn variant-ghost-error text-white-900 rounded uppercase font-semibold py-2.5 px-8 w-full mb-8"
			on:click={() => drawerStore.close()}
		>
			Close
		</button>
	</div>

	<div class="h-full w-full p-10 xl:py-18 lg:pl-[14rem]">
		<div class="lg:hidden flex justify-end">
			<button
				type="button"
				class="btn variant-ghost-error text-white-900 rounded uppercase font-semibold py-2.5 px-8 w-full mb-8"
				on:click={() => drawerStore.close()}
			>
				Close
			</button>
		</div>

		<Stepper on:complete={onCompleteHandler}>
			<Step locked={teamIds.length === 0}>
				<svelte:fragment slot="header">Select Requestee</svelte:fragment>
				<RMStep1
					bind:staffId
					bind:teamIds
					bind:teamEmails
					bind:maintenanceTeamId
					bind:selectedStaff
				/>
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
					{teamEmails}
					{maintenanceTeamId}
					{siteId}
					{regionId}
					{areaId}
					bind:onCompleteHandler
				/>
			</Step>
		</Stepper>
	</div>
</div>
