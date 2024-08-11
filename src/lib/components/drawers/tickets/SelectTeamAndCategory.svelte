<script>
	import { Autocomplete, getDrawerStore, RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	export let selectedTeamId, selectedCategoryId, selectedCategoryLevelId, selectedEquipmentId;

	const drawerStore = getDrawerStore();

	const teams = $drawerStore.meta.teams;
	const categories = $drawerStore.meta.categories;
	const categoryLevels = $drawerStore.meta.categoryLevels;
	const teamEquipment = $drawerStore.meta.teamEquipment;

	let selectedTeam, selectedCategoryLevel, selectedEquipment;

	let severityLevels = [];
	let equipmentList = [];

	const teamOptions = teams.map((team) => ({
		label: team.name,
		value: team.id
	}));

	function onTeamSelect(e) {
		selectedTeamId = e.detail.value;
		selectedTeam = e.detail.label;
	}

	function onLevelSelect(e) {
		selectedCategoryLevelId = e.detail.value;
		selectedCategoryLevel = e.detail.label;
	}

	function onEquipmentSelect(e) {
		selectedEquipmentId = e.detail.value;
		selectedEquipment = e.detail.label;
	}

	$: {
		severityLevels = categoryLevels
			.filter((level) => level.categoryId === selectedCategoryId)
			.map((level) => ({
				label: level.name,
				value: level.id
			}));

		equipmentList = teamEquipment
			.filter((eq) => eq.expand.teamId.name === selectedTeam)
			.map((eq) => ({
				label: eq.name,
				value: eq.id
			}));
	}
</script>

<div class="flex flex-col gap-10">
	<form class="flex flex-col gap-4">
		<input
			class="input"
			type="search"
			name="team"
			bind:value={selectedTeam}
			placeholder="Search Team ..."
			required
			on:change={() => {
				selectedCategoryLevel = null;
				selectedEquipment = null;
			}}
		/>

		<div class="card w-full max-h-48 p-4 overflow-y-auto" tabindex="-1">
			<Autocomplete bind:input={selectedTeam} options={teamOptions} on:selection={onTeamSelect} />
		</div>
	</form>

	<div class="flex flex-col gap-4">
		<h4 class="h4 font-bold">Select Severity Category & Severity Level</h4>

		<RadioGroup class="w-1/2">
			{#each categories as category}
				<RadioItem
					bind:group={selectedCategoryId}
					name={category.name}
					value={category.id}
					on:change={() => (selectedCategoryLevel = null)}
				>
					{category.name}
				</RadioItem>
			{/each}
		</RadioGroup>

		<form class="flex flex-col justify-between gap-4">
			<input
				class="input"
				type="search"
				name="categoryLevel"
				bind:value={selectedCategoryLevel}
				placeholder={!selectedCategoryId
					? 'Please select a category first ...'
					: 'Search Category Level ...'}
				disabled={!selectedCategoryId}
				required
			/>

			<div class="card w-full max-h-48 p-4 overflow-y-auto" tabindex="-1">
				<Autocomplete
					bind:input={selectedCategoryLevel}
					options={severityLevels}
					on:selection={onLevelSelect}
				/>
			</div>

			<h4 class="h4 font-bold mt-4">Select Team Equipment</h4>

			<input
				class="input"
				type="search"
				name="categoryLevel"
				bind:value={selectedEquipment}
				placeholder={!selectedTeam ? 'Please select an area first ...' : 'Search Site ...'}
				disabled={!selectedTeam}
				required
			/>

			<div class="card w-full max-h-48 p-4 overflow-y-auto" tabindex="-1">
				<Autocomplete
					bind:input={selectedEquipment}
					options={equipmentList}
					on:selection={onEquipmentSelect}
				/>
			</div>
		</form>
	</div>
</div>
