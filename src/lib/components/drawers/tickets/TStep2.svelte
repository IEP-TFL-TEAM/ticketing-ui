<script>
	import { onMount } from 'svelte';
	import { getRegionList } from '$lib/api/region';
	import { getAreaList } from '$lib/api/area';
	import { getSiteList } from '$lib/api/sites';

	import { Autocomplete, RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	export let regionId, areaId, siteId, selectedArea, selectedSite;

	let regions = [],
		areas = [],
		sites = [];

	onMount(async () => {
		const results = await Promise.allSettled([getRegionList(), getAreaList(), getSiteList()]);

		[regions, areas, sites] = results.map((result) =>
			result.status === 'fulfilled' ? result.value : []
		);

		// Sort alphabetically by name
		regions = regions.sort((a, b) => a.name.localeCompare(b.name));
		areas = areas.sort((a, b) => a.name.localeCompare(b.name));
		sites = sites.sort((a, b) => a.name.localeCompare(b.name));
	});

	function onAreaSelect(e) {
		areaId = e.detail.value;
		selectedArea = e.detail.label;
	}

	function onSiteSelect(e) {
		siteId = e.detail.value;
		selectedSite = e.detail.label;
	}

	let areaList = [],
		siteList = [];

	$: {
		areaList = areas
			.filter((area) => area.regionId === regionId)
			.map(({ id, name }) => ({
				value: id,
				label: name
			}));

		siteList = sites
			.filter((site) => site.expand.areaId.name === selectedArea)
			.map(({ id, name }) => ({
				value: id,
				label: name
			}));
	}
</script>

<div class="flex flex-col gap-10">
	<div class="flex flex-col gap-4">
		<RadioGroup class="w-1/2">
			{#each regions as item}
				<RadioItem
					bind:group={regionId}
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
				placeholder={!regionId ? 'Please select a region first ...' : 'Search Area ...'}
				disabled={!regionId}
				on:change={() => (selectedSite = null)}
				required
			/>

			<div class="card w-full max-h-[20rem] p-4 overflow-y-auto" tabindex="-1">
				<Autocomplete bind:input={selectedArea} options={areaList} on:selection={onAreaSelect} />
			</div>
		</form>

		<form class="flex flex-col justify-between gap-4 mt-4">
			<h4 class="h4 font-bold">
				Select Site
				<span class="text-red-500">*</span>
			</h4>

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
