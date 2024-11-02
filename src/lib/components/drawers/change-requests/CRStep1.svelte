<script>
	import { Autocomplete, getDrawerStore, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';

	export let staffId, teamIds, teamEmails, selectedStaff, cteamId;

	const drawerStore = getDrawerStore();

	const staff = $drawerStore.meta.staff;
	const teams = $drawerStore.meta.teams;
	const changeTeams = $drawerStore.meta.changeTeams;

	const staffOptions = staff.map((item) => ({
		label: item.name,
		value: item.id
	}));

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

	const changeTeamOptions = changeTeams.map((team) => ({
		label: team.name,
		value: team.id
	}));

	function onStaffSelect(e) {
		staffId = e.detail.value;
		selectedStaff = e.detail.label;
	}
</script>

<div class="flex flex-col gap-10">
	<form class="flex flex-col gap-4">
		<input
			class="input"
			type="search"
			name="team"
			bind:value={selectedStaff}
			placeholder="Search Team ..."
			required
		/>

		<div class="card w-full max-h-48 p-4 overflow-y-auto" tabindex="-1">
			<Autocomplete bind:input={staffId} options={staffOptions} on:selection={onStaffSelect} />
		</div>
	</form>

	<div class="flex flex-col gap-4">
		<h4 class="h4 font-bold">
			Select Technical Groups Involved
			<span class="text-red-500">*</span>
		</h4>

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
	</div>

	<div class="flex flex-col gap-4">
		<h4 class="h4 font-bold">Select Change Team</h4>

		<form class="card w-full max-h-48 p-4 overflow-y-auto" tabindex="-1">
			<ListBox>
				{#each changeTeamOptions as { value, label }}
					<ListBoxItem bind:group={cteamId} name="medium" {value}>
						{label}
					</ListBoxItem>
				{/each}
			</ListBox>
		</form>
	</div>
</div>
