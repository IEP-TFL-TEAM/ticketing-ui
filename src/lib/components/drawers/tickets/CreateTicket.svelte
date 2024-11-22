<script>
	import { Stepper, Step, getDrawerStore } from '@skeletonlabs/skeleton';
	import TStep1 from './TStep1.svelte';
	import TStep2 from './TStep2.svelte';
	import TStep3 from './TStep3.svelte';

	const drawerStore = getDrawerStore();

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
			<Step
				locked={!(
					teamIds.length > 0 &&
					catId &&
					selectedCatLevel &&
					equipIds.length > 0 &&
					departmentIds.length > 0
				)}
			>
				<svelte:fragment slot="header">
					Select Severity Category & Severity Level
					<span class="text-red-500">*</span>
				</svelte:fragment>
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
				<svelte:fragment slot="header">
					Select Region
					<span class="text-red-500">*</span>
				</svelte:fragment>
				<TStep2 bind:regionId bind:areaId bind:siteId bind:selectedArea bind:selectedSite />
			</Step>

			<Step>
				<svelte:fragment slot="header">
					Ticket Details
					<span class="text-red-500">*</span>
				</svelte:fragment>
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
</div>
