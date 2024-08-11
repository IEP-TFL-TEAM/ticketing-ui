<script>
	import { Autocomplete, getDrawerStore, RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	export let selectedRegionId, selectedAreaId, selectedSiteId;

	const drawerStore = getDrawerStore();

	const regions = $drawerStore.meta.regions;
	const areas = $drawerStore.meta.areas;
	const sites = $drawerStore.meta.sites;

	let selectedArea = null,
		selectedSite = null;

	let areaList = [];
	let siteList = [];

	function onAreaSelect(e) {
		selectedAreaId = e.detail.value;
		selectedArea = e.detail.label;
	}

	function onSiteSelect(e) {
		selectedSiteId = e.detail.value;
		selectedSite = e.detail.label;
	}

	$: {
		areaList = areas
			.filter((area) => area.regionId === selectedRegionId)
			.map((area) => ({
				label: area.name,
				value: area.id
			}));

		siteList = sites
			.filter((site) => site.expand.areaId.name === selectedArea)
			.map((site) => ({
				label: site.name,
				value: site.id
			}));
	}
</script>

<div class="flex flex-col gap-10">
	<div class="flex flex-col gap-4">
		<RadioGroup class="w-1/2">
			{#each regions as item}
				<RadioItem
					bind:group={selectedRegionId}
					name={item.name}
					value={item.id}
					on:change={() => {
						selectedArea = null;
						selectedSite = null;
					}}
				>
					{item.name}
				</RadioItem>
			{/each}
		</RadioGroup>

		<form class="flex flex-col justify-between gap-4">
			<input
				class="input"
				type="search"
				name="area"
				bind:value={selectedArea}
				placeholder={!selectedRegionId ? 'Please select a region first ...' : 'Search Area ...'}
				disabled={!selectedRegionId}
				on:change={() => (selectedSite = null)}
				required
			/>

			<div class="card w-full max-h-[20rem] p-4 overflow-y-auto" tabindex="-1">
				<Autocomplete bind:input={selectedArea} options={areaList} on:selection={onAreaSelect} />
			</div>
		</form>

		<form class="flex flex-col justify-between gap-4 mt-4">
			<h4 class="h4 font-bold">Select Site</h4>

			<input
				class="input"
				type="search"
				name="categoryLevel"
				bind:value={selectedSite}
				placeholder={!selectedArea ? 'Please select an area first ...' : 'Search Site ...'}
				disabled={!selectedArea}
				required
			/>

			<div class="card w-full max-h-48 p-4 overflow-y-auto" tabindex="-1">
				<Autocomplete bind:input={selectedSite} options={siteList} on:selection={onSiteSelect} />
			</div>
		</form>
	</div>
</div>
