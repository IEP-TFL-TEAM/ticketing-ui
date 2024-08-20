<script>
	import { updateRecipientByStatus, removeRecipient } from '$lib/api/recipients';
	import { ListBox, ListBoxItem, getModalStore, getToastStore } from '@skeletonlabs/skeleton';

	export let parent;

	const modalStore = getModalStore();
	const toastStore = getToastStore();
	const recipient = $modalStore[0].meta.recipient;

	let selectedOption;
	let loading = false;

	async function onFormSubmit() {
		loading = true;

		try {
			let message;
			if (selectedOption === 'delete') {
				await removeRecipient(recipient.id);
				message = 'Successfully removed recipient!';
			} else {
				const updatedRecipient = await updateRecipientByStatus(recipient.id, {
					...recipient,
					verified: selectedOption === 'verify' ? true : false
				});
				$modalStore[0].response({ updatedRecipient });
				message = 'Updated recipient status successfully!';
			}

			toastStore.trigger({
				message,
				classes: 'variant-filled-success'
			});
		} catch (error) {
			toastStore.trigger({
				message: error.error_description || error.message,
				background: 'bg-[#252424] text-white',
				classes: 'hover:scale-110 border-l-4 border-red-500 shadow-2xl transition'
			});
		} finally {
			loading = false;
			modalStore.close();
		}
	}
</script>

<div
	class="flex flex-col bg-white shadow-2xl px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-none w-full max-w-md dark:bg-neutral-900"
>
	<div
		class="mb-5 font-bold self-center text-xl sm:text-2xl uppercase text-primary-500 dark:text-tertiary-500 text-center"
	>
		Actions
	</div>

	<ListBox
		rounded="rounded-none"
		class=" bg-white dark:bg-neutral-900"
		active="border font-bold dark:border-tertiary-500 border-primary-500 dark:text-white text-black"
		disabled={loading}
		hover="hover:variant-soft-primary dark:hover:variant-soft-tertiary"
	>
		<ListBoxItem
			bind:group={selectedOption}
			name="medium"
			value={recipient.verified ? 'unverify' : 'verify'}
		>
			{recipient.verified ? 'Unverify' : 'Verify'}
		</ListBoxItem>
		<ListBoxItem bind:group={selectedOption} name="medium" value="delete">Delete</ListBoxItem>
	</ListBox>

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
