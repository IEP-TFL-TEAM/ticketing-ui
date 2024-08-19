<script>
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { assignTeam } from '$lib/api/teams';
	import { currentUser } from '$lib/stores/auth';

	export let data;
	$: teams = data.teams;
	$: users = data.users;
	$: filteredUsers = users.filter((u) => u.teamId === '');

	const modalStore = getModalStore();
	const toastStore = getToastStore();
	let isAdmin = $currentUser?.role === 'admin';

	function changeTeam(userId) {
		modalStore.trigger({
			type: 'component',
			title: 'Assign Ticket',
			component: 'assignTicket',
			body: 'Select a team to assign to',
			meta: { teams: [...teams, { id: null, name: 'UNASSIGNED' }] },
			response: async (team) => {
				if (team) {
					const updatedUser = await assignTeam(userId, team.id);
					users = users.map((user) => (user.id === userId ? updatedUser : user));

					toastStore.trigger({
						message: 'User team has been successfully assigned',
						background: 'variant-filled-success'
					});
				}
			}
		});
	}
</script>

<div class="w-full mt-5">
	<h1 class="h1 font-extrabold">Team Management</h1>
	<p class="mb-8">Manage your team members and their account permissions here.</p>

	<div class="grid grid-cols-2 gap-4">
		{#each teams as team}
			<div class="col-auto">
				<div class="rounded-md overflow-hidden">
					<div class="px-4 py-2 flex items-center justify-between">
						<h3 class="font-bold">{team.name}</h3>
						<span class="text-sm">{users.filter((u) => u.teamId === team.id).length} Members</span>
					</div>
					<table class="w-full table table-compact rounded-none">
						<thead>
							<tr class="border-b">
								<th class="px-4 py-3 text-left">Name</th>
								<th class="px-4 py-3 text-left">Role</th>
								<th class="px-4 py-3 text-left">Assign</th>
							</tr>
						</thead>
						<tbody>
							{#each users.filter((u) => u.teamId === team.id) as user}
								<tr class="border-b">
									<td class="px-4 py-3 font-medium">{user.firstName} {user.lastName}</td>
									<td class="px-4 py-3">{user.role}</td>

									{#if isAdmin}
										<td class="py-3">
											<button
												class="btn variant-filled-primary p-1 text-sm"
												on:click={() => changeTeam(user.id)}>Reassign</button
											>
										</td>
									{/if}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/each}

		<div class="col-auto">
			<div class="rounded-md overflow-hidden">
				<div class="px-4 py-2 flex items-center justify-between">
					<h3 class="font-bold">Unassigned</h3>
					<span class="text-sm">{filteredUsers.length} Members</span>
				</div>

				<table class="w-full table table-compact rounded-none">
					<thead>
						<tr class="border-b">
							<th class="px-4 py-3 text-left">Name</th>
							<th class="px-4 py-3 text-left">Role</th>
							<th class="px-4 py-3 text-left">Assign</th>
						</tr>
					</thead>

					<tbody>
						{#each filteredUsers as user}
							<tr class="border-b">
								<td class="px-4 py-3 font-medium">{user.firstName} {user.lastName}</td>
								<td class="px-4 py-3">{user.role}</td>

								{#if isAdmin}
									<td class="py-3">
										<button
											class="btn variant-filled-primary p-1 text-sm"
											on:click={() => changeTeam(user.id)}>Reassign</button
										>
									</td>
								{/if}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
