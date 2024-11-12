<script>
	import { updateRecipientByStatus, removeRecipient } from '$lib/api/recipients';
	import {
		ListBox,
		ListBoxItem,
		getModalStore,
		getToastStore,
		getDrawerStore
	} from '@skeletonlabs/skeleton';

	export let parent;

	const modalStore = getModalStore();
	const toastStore = getToastStore();
	const drawerStore = getDrawerStore();
	const recipient = $modalStore[0].meta.recipient;
	const sortedRecipients = $modalStore[0].meta.sortedRecipients;

	let selectedOption;
	let loading = false;

	$: verfiedRecipients = sortedRecipients.filter((item) => item.verified).length;
	$: onlyOneVerified = verfiedRecipients === 1 ? true : false;

	async function onFormSubmit() {
		loading = true;

		try {
			let message;
			if (selectedOption === 'delete') {
				await removeRecipient(recipient.id);
				message = 'Removed Recipient Successfully';
			} else {
				const updatedRecipient = await updateRecipientByStatus(recipient.id, {
					...recipient,
					verified: selectedOption === 'verify' ? true : false
				});
				$modalStore[0].response({ updatedRecipient });
				message = 'Recipient Status Updated Successfully';
			}

			toastStore.trigger({
				message,
				background: 'variant-filled-success',
				classes: 'rounded-none font-semibold',
				timeout: 3000
			});
		} catch (error) {
			toastStore.trigger({
				message: error.error_description || error.message,
				background: 'bg-[#252424] text-white',
				classes: 'hover:scale-110 border-l-4 border-red-500 shadow-2xl transition',
				timeout: 3000
			});
		} finally {
			loading = false;
			modalStore.close();
		}
	}

	function triggerDrawer(id, position, record) {
		modalStore.close();
		drawerStore.open({
			id,
			position,
			meta: { record, sortedRecipients }
		});
	}
</script>

<div class="p-5 card w-full max-w-md flex flex-col bg-white dark:bg-neutral-900">
	<h3 class="mb-5 text-xl text-primary-500 dark:text-tertiary-500 font-bold uppercase">
		Actions - {recipient.name}
	</h3>
	<hr class="-mt-2" />

	<ListBox
		rounded="rounded-none"
		class="bg-white dark:bg-neutral-900 mt-4"
		active="border font-bold dark:border-tertiary-500 border-primary-500 dark:text-white text-black"
		disabled={loading}
		hover="hover:variant-soft-primary dark:hover:variant-soft-tertiary"
	>
		<ListBoxItem
			bind:group={selectedOption}
			name="medium"
			value="update"
			on:click={() => triggerDrawer('updateRecipient', 'right', recipient)}
		>
			Update
		</ListBoxItem>
		<ListBoxItem
			bind:group={selectedOption}
			name="medium"
			value={recipient.verified ? 'unverify' : 'verify'}
			disabled={(onlyOneVerified && recipient.verified) || recipient.type === 'CC'}
		>
			{recipient.verified ? 'Unverify' : 'Verify'}
		</ListBoxItem>
		<ListBoxItem
			bind:group={selectedOption}
			name="medium"
			value="delete"
			disabled={onlyOneVerified && recipient.verified}
		>
			Delete
		</ListBoxItem>
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
