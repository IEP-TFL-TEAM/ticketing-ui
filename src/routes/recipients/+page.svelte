<script>
	import { onDestroy, onMount } from 'svelte';
	import pb from '$lib/api/pocketbaseClient';
	import { getDrawerStore, getModalStore, getToastStore, popup } from '@skeletonlabs/skeleton';
	import { IconUserPlus, IconArrowRight, IconInfoCircle } from '@tabler/icons-svelte';

	export let data;

	$: ({ recipients } = data);
	$: sortedRecipients = recipients.sort((a, b) => {
		const aStatus = a.name ? (a.verified ? 1 : 2) : 3;
		const bStatus = b.name ? (b.verified ? 1 : 2) : 3;
		return aStatus - bStatus;
	});

	const drawerStore = getDrawerStore();
	const toastStore = getToastStore();
	const modalStore = getModalStore();

	const popupFeatured = {
		event: 'click',
		target: 'popupFeatured',
		placement: 'bottom'
	};

	function triggerDrawer(id, position) {
		drawerStore.open({
			id,
			position,
			meta: { recipients }
		});
	}

	function displayUserActions(recipient) {
		modalStore.trigger({
			type: 'component',
			component: 'recipientActions',
			meta: { recipient, sortedRecipients },
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
		unSubscribe = await pb.collection('recipients').subscribe('*', async function (e) {
			let message =
				e.action === 'create'
					? 'A new recipient has been created'
					: `Recipient has been ${e.action}d!`;

			toastStore.clear();
			toastStore.trigger({
				message,
				timeout: 3000,
				classes: 'rounded-none font-semibold'
			});

			updateRecipients(e);
		});
	});

	onDestroy(() => {
		unSubscribe?.();
	});

	const tableHeaderStyles = 'px-6 font-semibold py-2';
	const tdStyles = 'px-6 py-4';
</script>

<div class="flex flex-col mt-5 w-full">
	<div class="flex justify-between items-start mb-8">
		<div class="flex flex-col justify-between gap-2">
			<div class="flex justify-between items-center">
				<h1 class="h1 font-extrabold">Recipients</h1>
				<button type="button" class="btn btn-icon" use:popup={popupFeatured}>
					<IconInfoCircle />
				</button>
			</div>

			<p class="p text-xl mt-2">Manage email recipients for the Incidents Module.</p>

			<div
				class="card p-4 w-92 shadow-xl bg-white border rounded border-primary-500 dark:bg-neutral-900 dark:border-tertiary-700 z-10"
				data-popup="popupFeatured"
			>
				<div>
					<dl class="list-dl">
						<div>
							<span class="flex-auto">
								<dt>
									Type = <span
										class="text-primary-500 dark:text-tertiary-500 font-semibold uppercase"
										>Broadcast
									</span>
									& Status =
									<span class="text-success-700 dark:text-success-500 font-semibold uppercase"
										>Verified
									</span>
								</dt>
								<dd>These are the emails made available for Email Broadcasts</dd>
							</span>
						</div>

						<div>
							<span class="flex-auto">
								<dt>
									Type = <span class="text-primary-500 dark:text-tertiary-500 font-semibold"
										>CC
									</span>
								</dt>
								<dd>
									This is the default email to be CC'd for auto emails after a successful incident
									creation
								</dd>
							</span>
						</div>
					</dl>
				</div>

				<div
					class="arrow bg-white dark:bg-neutral-900 border border-primary-500 dark:border-tertiary-700"
				/>
			</div>
		</div>

		<button
			type="button"
			class="btn rounded-none variant-filled-primary"
			on:click={() => triggerDrawer('addRecipient', 'right')}
		>
			<IconUserPlus size={20} />
			<span> New Recipient </span>
		</button>
	</div>
</div>

{#if sortedRecipients.length === 0}
	<div class="flex items-center justify-center w-full h-96">
		<p class="text-black dark:text-white font-medium">Oops... No recipients found!</p>
	</div>
{:else}
	<div class="relative mt-5 overflow-x-auto">
		<table class="w-full text-sm text-left">
			<thead class="uppercase bg-gray-100 dark:bg-neutral-700">
				<tr>
					<th scope="col" class={tableHeaderStyles}> Name </th>
					<th scope="col" class={tableHeaderStyles}> Email </th>
					<th scope="col" class={tableHeaderStyles}> Type </th>
					<th scope="col" class={tableHeaderStyles}> Status </th>
					<th scope="col" class={tableHeaderStyles}></th>
					<th scope="col"></th>
				</tr>
			</thead>
			<tbody>
				{#each sortedRecipients as recipient}
					<tr
						class="transition-colors bg-white border-b rounded dark:bg-neutral-800 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-900"
					>
						<td class={tdStyles}>{recipient.name}</td>
						<td class={tdStyles}>{recipient.email}</td>
						<td class={`text-primary-500 dark:text-tertiary-500 font-semibold ${tdStyles}`}
							>{recipient.type}</td
						>
						<td
							class="{tdStyles} font-semibold uppercase {recipient.verified
								? 'text-success-700 dark:text-success-500'
								: 'text-error-500'}"
						>
							{recipient.verified ? 'Verified' : 'Unverified'}
						</td>

						<td class={tdStyles}>
							<button
								type="button"
								class="font-medium text-primary-500 dark:text-tertiary-500 hover:underline cursor-pointer"
								on:click={() => displayUserActions(recipient)}
							>
								<IconArrowRight />
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
