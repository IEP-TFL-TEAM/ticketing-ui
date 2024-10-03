<script>
	import {
		Autocomplete,
		getDrawerStore,
		RadioGroup,
		RadioItem,
		ListBox,
		ListBoxItem
	} from '@skeletonlabs/skeleton';

	export let teamIds, catId, catLevelId, equipIds, selectedCatLevel;

	const drawerStore = getDrawerStore();

	const teams = $drawerStore.meta.teams;
	const categories = $drawerStore.meta.categories;
	const categoryLevels = $drawerStore.meta.categoryLevels;
	const teamEquipment = $drawerStore.meta.teamEquipment;

	let severityLevels = [];

	const teamOptions = teams.map((team) => ({
		label: team.name,
		value: team.id
	}));

	function onLevelSelect(e) {
		catLevelId = e.detail.value;
		selectedCatLevel = e.detail.label;
	}

	$: {
		severityLevels = categoryLevels
			.filter((level) => level.categoryId === catId)
			.map((level) => ({
				label: level.name,
				value: level.id
			}));
	}
</script>

<div class="flex flex-col gap-10">
	<form class="card w-full max-h-48 p-4 overflow-y-auto" tabindex="-1">
		<ListBox multiple>
			{#each teamOptions as { value, label }}
				<ListBoxItem bind:group={teamIds} name="medium" {value}>
					{label}
				</ListBoxItem>
			{/each}
		</ListBox>
	</form>

	<div class="flex flex-col gap-4">
		<h4 class="h4 font-bold">Select Severity Category & Severity Level</h4>

		<RadioGroup class="w-1/2">
			{#each categories as category}
				<RadioItem
					bind:group={catId}
					name={category.name}
					value={category.id}
					on:change={() => (selectedCatLevel = null)}
				>
					{category.name}
				</RadioItem>
			{/each}
		</RadioGroup>

		<form class="flex flex-col justify-between gap-4">
			<div class="card w-full max-h-48 p-4 overflow-y-auto" tabindex="-1">
				<Autocomplete
					bind:input={selectedCatLevel}
					options={severityLevels}
					on:selection={onLevelSelect}
				/>
			</div>

			<h4 class="h4 font-bold mt-4">Select Team Equipment(s)</h4>

			<div class="card w-full max-h-48 p-4 overflow-y-auto" tabindex="-1">
				<ListBox multiple>
					{#each teamEquipment as { id, name }}
						<ListBoxItem bind:group={equipIds} name="medium" value={id}>
							{name}
						</ListBoxItem>
					{/each}
				</ListBox>
			</div>
		</form>
	</div>
</div>
