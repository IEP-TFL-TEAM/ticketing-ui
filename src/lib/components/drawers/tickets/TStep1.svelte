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
	const departments = $drawerStore.meta.departments;
	const categories = $drawerStore.meta.categories;
	const categoryLevels = $drawerStore.meta.categoryLevels;
	const departmentEquipments = $drawerStore.meta.departmentEquipments;

	let severityLevels = [];
	let equipmentList = [];

	const teamOptions = teams
		.map((team) => ({
			label: team.name,
			value: team.id,
			email: team.email
		}))
		.sort((a, b) => {
			if (a.label < b.label) return -1;
			if (a.label > b.label) return 1;
			return 0;
		});

	const departmentOptions = departments
		.map((dep) => ({
			label: dep.name,
			value: dep.id
		}))
		.sort((a, b) => {
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

		equipmentList = departmentEquipments
			.filter((eq) => departmentIds.includes(eq.departmentId))
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
		</form>
	</div>

	<div class="flex flex-col gap-4">
		<h4 class="h4 font-bold">Selected Deparments Concerned</h4>

		<form class="card w-full max-h-48 p-4 overflow-y-auto" tabindex="-1">
			<ListBox multiple>
				{#each departmentOptions as { value, label }}
					<ListBoxItem bind:group={departmentIds} name="medium" {value}>
						{label}
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
					{#each teamOptions as { value, label, email }}
						<ListBoxItem
							bind:group={teamIds}
							name="medium"
							{value}
							on:click={() => {
								teamEmails.includes(email)
									? (teamEmails = teamEmails.filter((item) => item !== email))
									: teamEmails.push(email);
							}}
						>
							{label}
						</ListBoxItem>
					{/each}
				</ListBox>
			</form>
		</form>
	</div>
</div>
