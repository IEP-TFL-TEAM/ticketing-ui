<script>
	import { ListBox, ListBoxItem, getModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();
	let teams = $modalStore[0].meta?.teams;

	export let parent;

	let selectedTeam;

	function onFormSubmit() {
		if ($modalStore[0].response) $modalStore[0].response(selectedTeam);
		modalStore.close();
	}
</script>

<div class="modal-example-form card p-4 w-modal shadow-xl space-y-4">
	<header class="text-2xl font-bold">{$modalStore[0]?.title ?? '(title missing)'}</header>

	<article>{$modalStore[0]?.body ?? '(body missing)'}</article>

	<ListBox class="border border-surface-500 p-4 rounded-container-token">
		{#each teams as team}
			<ListBoxItem bind:group={selectedTeam} name={team.name} value={team}>
				{team.name}
			</ListBoxItem>
		{/each}
	</ListBox>

	<footer class="modal-footer {parent.regionFooter}">
		<button type="button" class="btn {parent.buttonNeutral}" on:click={parent.onClose}>
			{parent.buttonTextCancel}
		</button>

		<button class="btn {parent.buttonPositive}" on:click={() => onFormSubmit()}>
			Assign {selectedTeam ? `${selectedTeam.name}` : 'a team'}
		</button>
	</footer>
</div>
