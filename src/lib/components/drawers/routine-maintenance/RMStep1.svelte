<script>
	import { Autocomplete, getDrawerStore, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';

	export let staffId,
		teamIds,
		maintenanceTeamId,
		siteId,
		selectedStaff,
		selectedMTeam,
		selectedSite;

	const drawerStore = getDrawerStore();

	const staff = $drawerStore.meta.staff;
	const teams = $drawerStore.meta.teams;
	const maintenanceTeams = $drawerStore.meta.maintenanceTeams;
	const sites = $drawerStore.meta.sites;

	const staffOptions = staff.map((item) => ({
		label: item.name,
		value: item.id
	}));

	const teamOptions = teams.map((team) => ({
		label: team.name,
		value: team.id
	}));

	const maintenanceTeamOptions = maintenanceTeams.map((team) => ({
		label: team.name,
		value: team.id
	}));

	const siteOptions = sites.map((team) => ({
		label: team.name,
		value: team.id
	}));

	function onStaffSelect(e) {
		staffId = e.detail.value;
		selectedStaff = e.detail.label;
	}

	function onMTeamSelect(e) {
		maintenanceTeamId = e.detail.value;
		selectedMTeam = e.detail.label;
	}

	function onSiteSelect(e) {
		siteId = e.detail.value;
		selectedSite = e.detail.label;
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
		<h4 class="h4 font-bold">Select Team Conducting Maintenance</h4>

		<form class="card w-full max-h-48 p-4 overflow-y-auto" tabindex="-1">
			<ListBox multiple>
				{#each teamOptions as { value, label }}
					<ListBoxItem bind:group={teamIds} name="medium" {value}>
						{label}
					</ListBoxItem>
				{/each}
			</ListBox>
		</form>
	</div>

	<div class="flex flex-col gap-4">
		<h4 class="h4 font-bold">Select Maintenance Team</h4>

		<form class="flex flex-col gap-4">
			<input
				class="input"
				type="search"
				name="team"
				bind:value={selectedMTeam}
				placeholder="Search Maintenance Team ..."
				required
			/>

			<div class="card w-full max-h-48 p-4 overflow-y-auto" tabindex="-1">
				<Autocomplete
					bind:input={selectedMTeam}
					options={maintenanceTeamOptions}
					on:selection={onMTeamSelect}
				/>
			</div>
		</form>
	</div>

	<div class="flex flex-col gap-4">
		<h4 class="h4 font-bold">Select Site</h4>

		<form class="flex flex-col gap-4">
			<input
				class="input"
				type="search"
				name="team"
				bind:value={selectedSite}
				placeholder="Search Site ..."
				required
			/>

			<div class="card w-full max-h-48 p-4 overflow-y-auto" tabindex="-1">
				<Autocomplete bind:input={selectedSite} options={siteOptions} on:selection={onSiteSelect} />
			</div>
		</form>
	</div>
</div>
