<script>
	import { onDestroy, onMount } from 'svelte';
	import pb from '$lib/api/pocketbaseClient';
	import { getDrawerStore, getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { IconPlus, IconArrowRight } from '@tabler/icons-svelte';

	export let data;

	$: ({ recipients, categories } = data);
	$: sortedRecipients = recipients.sort((a, b) => {
		const aStatus = a.name ? (a.verified ? 1 : 2) : 3;
		const bStatus = b.name ? (b.verified ? 1 : 2) : 3;
		return aStatus - bStatus;
	});

	const drawerStore = getDrawerStore();
	const toastStore = getToastStore();
	const modalStore = getModalStore();

	function triggerDrawer(id, position) {
		drawerStore.open({
			id,
			position,
			meta: {
				categories
			}
		});
	}

	function displayUserActions(recipient) {
		modalStore.trigger({
			type: 'component',
			component: 'recipientActions',
			meta: { recipient, sortedRecipients, categories },
			response: (r) => {
				if (r) {
					recipients = [
						r.updatedRecipient,
						...recipients.filter((item) => item.id !== r.updatedRecipient.id)
					];
				}
			}
		});
	}

	function updateRecipients(e) {
		const { record } = e;

		switch (e.action) {
			case 'create':
				recipients = [...recipients, record];
				break;

			case 'delete':
				recipients = recipients.filter((item) => item.id !== record.id);
				break;

			case 'update':
				recipients = recipients.map((item) => (item.id === record.id ? record : item));
				break;

			default:
				return;
		}
	}

	let unSubscribe;

	onMount(async () => {
		unSubscribe = await pb.collection('recipients').subscribe(
			'*',
			async function (e) {
				let message =
					e.action === 'create'
						? 'A new recipient has been created'
						: `Recipient has been ${e.action}d!`;

				toastStore.clear();
				toastStore.trigger({
					message,
					timeout: 3000
				});

				updateRecipients(e);
			},
			{
				expand: 'categoryId'
			}
		);
	});

	onDestroy(() => {
		unSubscribe?.();
	});

	const thStyle = '!font-semibold uppercase text-base px-6 py-2';
</script>

<div class="flex flex-col mt-5 w-full">
	<div class="flex justify-between items-center mb-8">
		<div class="flex flex-col justify-between gap-2">
			<h1 class="h1 font-extrabold">Recipients</h1>

			<p class="p text-xl">Manage recipients that will receive emails upon incident actions</p>
		</div>

		<button
			type="button"
			class="btn rounded-none variant-filled-primary"
			on:click={() => triggerDrawer('addRecipient', 'right')}
			disabled={categories.length === 0}
		>
			<IconPlus size={20} />
			<span> New Recipient </span>
		</button>
	</div>
</div>

{#if sortedRecipients.length === 0}
	<div class="flex items-center justify-center w-full h-96">
		<p class="text-black dark:text-white font-medium">Oops... No recipients found!</p>
	</div>
{:else}
	<div class="mt-5 table-container rounded-none">
		<table class="table table-interactive table-compact rounded-none">
			<thead>
				<tr class="bg-neutral-100 dark:bg-neutral-700 !font-light">
					<th class={thStyle}>id</th>
					<th class={thStyle}>name</th>
					<th class={thStyle}>email</th>
					<th class={thStyle}>category</th>
					<th class={thStyle}>status</th>
					<th class={thStyle}></th>
				</tr>
			</thead>

			<tbody class="bg-white dark:bg-neutral-800">
				{#each sortedRecipients as recipient}
					<tr
						class="bg-white hover:bg-neutral-50 border-b dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-900 transition-colors rounded"
						on:click={() => displayUserActions(recipient)}
					>
						<td class="px-6 py-4">{recipient.id}</td>
						<td class="px-6 py-4">{recipient.name}</td>
						<td class="px-6 py-4">{recipient.email}</td>
						<td class="px-6 py-4">{recipient.expand?.categoryId?.name}</td>
						<td
							class="px-6 py-4 font-semibold uppercase {recipient.verified
								? 'text-success-500'
								: 'text-error-500'}"
						>
							{recipient.verified ? 'Verified' : 'Unverified'}
						</td>

						<td class="px-6 py-4">
							<IconArrowRight />
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
