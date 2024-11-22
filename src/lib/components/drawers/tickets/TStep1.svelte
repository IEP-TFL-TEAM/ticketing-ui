<script>
	import { onMount } from 'svelte';
	import { getTeams } from '$lib/api/teams';
	import { getCategories } from '$lib/api/categories';
	import { getCategoryLevels } from '$lib/api/categoryLevels';
	import { getTeamEquipmentList } from '$lib/api/teamEquipments';

	import {
		Autocomplete,
		RadioGroup,
		RadioItem,
		ListBox,
		ListBoxItem
	} from '@skeletonlabs/skeleton';

	export let teamIds, catId, catLevelId, equipIds, selectedCatLevel, departmentIds, teamEmails;

	let teams = [],
		categories = [],
		categoryLevels = [],
		teamEquipments = [];

	onMount(async () => {
		const results = await Promise.allSettled([
			getTeams(),
			getCategories(),
			getCategoryLevels(),
			getTeamEquipmentList()
		]);

		[teams, categories, categoryLevels, teamEquipments] = results.map((result) =>
			result.status === 'fulfilled' ? result.value : []
		);

		// Sort alphabetically by name
		teams = teams.sort((a, b) => a.name.localeCompare(b.name));
		categories = categories.sort((a, b) => a.name.localeCompare(b.name));
		categoryLevels = categoryLevels.sort((a, b) => a.name.localeCompare(b.name));
		teamEquipments = teamEquipments.sort((a, b) => a.name.localeCompare(b.name));
	});

	function onLevelSelect(e) {
		catLevelId = e.detail.value;
		selectedCatLevel = e.detail.label;
	}

	let severityLevels = [],
		equipmentList = [];

	$: {
		severityLevels = categoryLevels
			.filter(({ categoryId }) => categoryId === catId)
			.map(({ id, name }) => ({
				value: id,
				label: name
			}));
		equipmentList = teamEquipments.filter(({ teamId }) => departmentIds.includes(teamId));
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
		<h4 class="h4 font-bold">
			Selected Departments Concerned
			<span class="text-red-500">*</span>
		</h4>

		<form class="card w-full max-h-48 p-4 overflow-y-auto" tabindex="-1">
			<ListBox multiple>
				{#each teams as { id, name }}
					<ListBoxItem bind:group={departmentIds} name="medium" value={id}>
						{name}
					</ListBoxItem>
				{/each}
			</ListBox>
		</form>

		<form class="flex flex-col justify-between gap-4">
			<h4 class="h4 font-bold mt-4">
				Select Department Equipment(s)
				<span class="text-red-500">*</span>
			</h4>

			<div class="card w-full max-h-48 p-4 overflow-y-auto" tabindex="-1">
				<ListBox multiple>
					{#each equipmentList as { id, name }}
						<ListBoxItem bind:group={equipIds} name="medium" value={id}>
							{name}
						</ListBoxItem>
					{/each}
				</ListBox>
			</div>

			<h4 class="h4 font-bold mt-4">
				Select Teams Assigned
				<span class="text-red-500">*</span>
			</h4>

			<form class="card w-full max-h-48 p-4 overflow-y-auto" tabindex="-1">
				<ListBox multiple>
					{#each teams as { id, name, email }}
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
