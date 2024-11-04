<script>
	import {
		Autocomplete,
		getDrawerStore,
		RadioGroup,
		RadioItem,
		ListBox,
		ListBoxItem
	} from '@skeletonlabs/skeleton';

	export let teamIds, catId, catLevelId, equipIds, selectedCatLevel, departmentIds, teamEmails;

	const drawerStore = getDrawerStore();

	const teams = $drawerStore.meta.teams;
	const categories = $drawerStore.meta.categories;
	const categoryLevels = $drawerStore.meta.categoryLevels;
	const teamEquipments = $drawerStore.meta.teamEquipments;

	let severityLevels = [];
	let equipmentList = [];

	const teamOptions = teams.sort((a, b) => {
		if (a.label < b.label) return -1;
		if (a.label > b.label) return 1;
		return 0;
	});

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
			}))
			.sort((a, b) => {
				if (a.label < b.label) return -1;
				if (a.label > b.label) return 1;
				return 0;
			});

		equipmentList = teamEquipments
			.filter((eq) => departmentIds.includes(eq.teamId))
			.map((eq) => ({
				label: eq.name,
				value: eq.id
			}))
			.sort((a, b) => {
				if (a.label < b.label) return -1;
				if (a.label > b.label) return 1;
				return 0;
			});
	}
</script>

<div class="flex flex-col gap-10">
	<div class="flex flex-col gap-4">
		<RadioGroup class="w-1/2">
			{#each categories as { id, name }}
				<RadioItem bind:group={catId} {name} value={id} on:change={() => (selectedCatLevel = null)}>
					{name}
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
		</form>
	</div>

	<div class="flex flex-col gap-4">
		<h4 class="h4 font-bold">Selected Deparments Concerned</h4>

		<form class="card w-full max-h-48 p-4 overflow-y-auto" tabindex="-1">
			<ListBox multiple>
				{#each teamOptions as { id, name }}
					<ListBoxItem bind:group={departmentIds} name="medium" value={id}>
						{name}
					</ListBoxItem>
				{/each}
			</ListBox>
		</form>

		<form class="flex flex-col justify-between gap-4">
			<h4 class="h4 font-bold mt-4">Select Deparment Equipment(s)</h4>

			<div class="card w-full max-h-48 p-4 overflow-y-auto" tabindex="-1">
				<ListBox multiple>
					{#each equipmentList as { value, label }}
						<ListBoxItem bind:group={equipIds} name="medium" {value}>
							{label}
						</ListBoxItem>
					{/each}
				</ListBox>
			</div>

			<h4 class="h4 font-bold mt-4">Select Teams Assigned</h4>

			<form class="card w-full max-h-48 p-4 overflow-y-auto" tabindex="-1">
				<ListBox multiple>
					{#each teamOptions as { id, name, email }}
						<ListBoxItem
							bind:group={teamIds}
							name="medium"
							value={id}
							on:click={() => {
								teamEmails.includes(email)
									? (teamEmails = teamEmails.filter((item) => item !== email))
									: teamEmails.push(email);
							}}
						>
							{name}
						</ListBoxItem>
					{/each}
				</ListBox>
			</form>
		</form>
	</div>
</div>
