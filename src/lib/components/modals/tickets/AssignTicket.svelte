<script>
	import { ListBox, ListBoxItem, getModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();
	const teams = $modalStore[0].meta.teams;

	export let parent;
	let teamIds = [];

	function onFormSubmit() {
		$modalStore[0].response({ teamIds });
		modalStore.close();
	}
</script>

<div
	class="card p-4 w-modal shadow-xl space-y-4 max-w-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700"
>
	<header class="text-2xl font-bold">Select team(s) involved to assign this ticket to:</header>

	<article>The newly assigned Teams will be notified.</article>

	<form
		class="card w-full max-h-[38rem] p-4 overflow-y-scroll bg-white dark:bg-neutral-900"
		tabindex="-1"
	>
		<div class="border border-surface-500 p-4 rounded-container-token overflow-y-auto">
			<ListBox multiple>
				{#each teams as { id, name }}
					<ListBoxItem bind:group={teamIds} {name} value={id}>
						{name}
					</ListBoxItem>
				{/each}
			</ListBox>
		</div>
	</form>

	<footer class="modal-footer {parent.regionFooter}">
		<button type="button" class="btn {parent.buttonNeutral}" on:click={parent.onClose}>
			{parent.buttonTextCancel}
		</button>

		<button
			type="button"
			class="btn {parent.buttonPositive}"
			on:click={() => onFormSubmit()}
			disabled={teamIds.length === 0}
		>
			Assign
		</button>
	</footer>
</div>
