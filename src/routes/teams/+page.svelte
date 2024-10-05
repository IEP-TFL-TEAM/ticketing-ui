<script>
	import { onDestroy, onMount } from 'svelte';
	import pb from '$lib/api/pocketbaseClient';
	import { getDrawerStore, getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { IconPlus, IconArrowRight } from '@tabler/icons-svelte';

	export let data;
	$: teams = data.teams;

	const drawerStore = getDrawerStore();
	const toastStore = getToastStore();
	const modalStore = getModalStore();

	function triggerDrawer(id, position) {
		drawerStore.open({
			id,
			position
		});
	}

	function displayTeamActions(team) {
		modalStore.trigger({
			type: 'component',
			component: 'teamActions',
			meta: { team },
			response: (r) => {
				if (r) {
					teams = [r.updatedTeam, ...teams.filter((item) => item.id !== r.updatedTeam.id)];
				}
			}
		});
	}

	function updateTeams(e) {
		const { record } = e;

		switch (e.action) {
			case 'create':
				teams = [...teams, record];
				break;

			case 'delete':
				teams = teams.filter((item) => item.id !== record.id);
				break;

			case 'update':
				teams = teams.map((item) => (item.id === record.id ? record : item));
				break;

			default:
				return;
		}
	}

	let unSubscribe;

	onMount(async () => {
		unSubscribe = await pb.collection('teams').subscribe('*', async function (e) {
			let message =
				e.action === 'create' ? 'A new team has been created' : `Team has been ${e.action}d!`;

			toastStore.trigger({
				message,
				timeout: 3000
			});

			updateTeams(e);
		});
	});

	onDestroy(() => {
		unSubscribe?.();
	});
</script>

<div class="flex flex-col mt-5 w-full">
	<div class="flex justify-between items-center mb-8">
		<div class="flex flex-col justify-between gap-2">
			<h1 class="h1 font-extrabold">Teams</h1>

			<p class="p text-xl">
				Lorem ipsum dolor, sit amet consectetur adipisicing elit. Error pariatur nesciunt quos.
			</p>
		</div>

		<button
			type="button"
			class="btn rounded-none variant-filled-primary"
			on:click={() => triggerDrawer('createTeam', 'right')}
		>
			<IconPlus size={20} />
			<span> New Team </span>
		</button>
	</div>
</div>

{#if teams.length === 0}
	<div class="flex items-center justify-center w-full h-96">
		<p class="text-black dark:text-white font-medium">Oops... No teams found!</p>
	</div>
{:else}
	<div class="mt-5 table-container rounded-none">
		<table class="table table-interactive table-compact rounded-none">
			<thead>
				<tr class="bg-neutral-100 dark:bg-neutral-700 !font-light">
					<th class="!font-semibold uppercase text-base px-6 py-2">id</th>
					<th class="!font-semibold uppercase text-base px-6 py-2">name</th>
					<th class="!font-semibold uppercase text-base px-6 py-2"></th>
				</tr>
			</thead>

			<tbody class="bg-white dark:bg-neutral-800">
				{#each teams as team}
					<tr
						class="bg-white hover:bg-neutral-50 border-b dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-900 transition-colors rounded"
						on:click={() => displayTeamActions(team)}
					>
						<td class="px-6 py-4">{team.id}</td>
						<td class="px-6 py-4">{team.name}</td>

						<td class="px-6 py-4">
							<IconArrowRight />
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
