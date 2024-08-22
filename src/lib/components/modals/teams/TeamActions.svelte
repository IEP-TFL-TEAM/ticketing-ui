<script>
	import { removeTeam, updateTeam } from '$lib/api/teams';
	import { ListBox, ListBoxItem, getModalStore, getToastStore } from '@skeletonlabs/skeleton';

	export let parent;

	const modalStore = getModalStore();
	const toastStore = getToastStore();
	const team = $modalStore[0].meta.team;

	let selectedOption;
	let loading = false;
	let teamName;

	async function onFormSubmit() {
		loading = true;

		try {
			let message;
			if (selectedOption === 'delete') {
				await removeTeam(team.id);
				message = 'Successfully removed team!';
			} else {
				if (!teamName) {
					loading = false;
					toastStore.trigger({
						message: 'Please provide a new name for the team',
						background: 'variant-filled-error'
					});
					return;
				}

				const updatedTeam = await updateTeam(team.id, {
					name: teamName
				});
				$modalStore[0].response({ updatedTeam });
				message = 'Updated team name successfully!';
			}

			toastStore.trigger({
				message,
				classes: 'variant-filled-success'
			});
		} catch (error) {
			toastStore.trigger({
				message: error.error_description || error.message,
				background: 'variant-filled-error'
			});
		} finally {
			loading = false;
			modalStore.close();
		}
	}
</script>

<div class="p-5 card w-full max-w-md flex flex-col bg-white dark:bg-neutral-900">
	<h3 class="mb-5 text-xl text-primary-500 dark:text-tertiary-500 font-bold uppercase">
		Team Actions - {team.name}
	</h3>
	<hr class="-mt-2" />

	<ListBox
		rounded="rounded-none"
		class="bg-white dark:bg-neutral-900 mt-4"
		active="border font-bold dark:border-tertiary-500 border-primary-500 dark:text-white text-black"
		disabled={loading}
		hover="hover:variant-soft-primary dark:hover:variant-soft-tertiary"
	>
		<ListBoxItem bind:group={selectedOption} name="medium" value="update">Update</ListBoxItem>
		<ListBoxItem bind:group={selectedOption} name="medium" value="delete">Delete</ListBoxItem>
	</ListBox>

	{#if selectedOption === 'update'}
		<form on:submit|preventDefault={onFormSubmit} class="mt-5 w-full">
			<label class="label">
				<p class="my-2 text-base font-semibold">
					Update Name
					<span class="text-red-500">*</span>
				</p>

				<input
					class="input p-4 border"
					type="text"
					name="name"
					bind:value={teamName}
					required
					placeholder={team.name}
				/>
			</label>
		</form>
	{/if}

	<div class="flex w-full justify-between mt-5">
		<button class="btn rounded-none variant-outline" on:click={parent.onClose}>
			{parent.buttonTextCancel}
		</button>

		<button
			class="btn rounded-none variant-filled-primary dark:variant-filled-tertiary"
			on:click={() => onFormSubmit()}
			disabled={!selectedOption}
		>
			Confirm
		</button>
	</div>
</div>
