<script>
	import pb from '$lib/api/pocketbaseClient';
	import { updateTicket } from '$lib/api/tickets';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import SpinnerOverlay from '$lib/components/layout/SpinnerOverlay.svelte';

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	const ticket = $modalStore[0].meta.ticket;
	const solutionCodes = $modalStore[0].meta.solutionCodes;
	const causeCodes = $modalStore[0].meta.causeCodes;

	const filteredSolutionCodes = solutionCodes
		.filter((code) => code.faultTypeId === ticket.faultTypeId)
		.sort((a, b) => {
			if (a.name < b.name) return -1;
			if (a.name > b.name) return 1;
			return 0;
		});
	const filteredCauseCodes = causeCodes.filter((code) => code.faultTypeId === ticket.faultTypeId);

	let cause;
	let solution;
	let closingRemarks;
	let loading = false;

	async function handleSubmit() {
		loading = true;

		if (!causeCodes.some((code) => code.id === cause)) {
			loading = false;
			toastStore.trigger({
				message: 'Cause must be one of the types',
				classes: 'variant-filled-error',
				timeout: 3000
			});
			return;
		}

		if (!solutionCodes.some((code) => code.id === solution)) {
			loading = false;
			toastStore.trigger({
				message: 'Solution must be one of the types',
				classes: 'variant-filled-error',
				timeout: 3000
			});
			return;
		}

		if (!closingRemarks) {
			loading = false;
			toastStore.trigger({
				message: 'Closing remakrs cannot be empty',
				classes: 'variant-filled-error',
				timeout: 3000
			});
			return;
		}

		try {
			const updatedTicket = await updateTicket({
				...ticket,
				status: 'CLOSED',
				closedBy: pb.authStore.model.id,
				solution,
				cause,
				closingRemarks,
				incidentEnd: new Date()
			});
			$modalStore[0].response({ updatedTicket });

			toastStore.trigger({
				message: 'Closed Incident Successfully',
				classes: 'variant-filled-success',
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
</script>

{#if loading}
	<SpinnerOverlay />
{/if}

<div
	class="p-5 card w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700"
>
	<h3 class="mb-5 text-xl text-primary-500 dark:text-tertiary-500 font-bold uppercase">
		Please provide the following to close the incident
	</h3>
	<hr />

	<form on:submit|preventDefault={handleSubmit}>
		<label class="label">
			<p class="my-2 text-base font-semibold">
				Select Cause
				<span class="text-red-500">*</span>
			</p>
			<div class="flex flex-row">
				<select
					class="select rounded-none w-full bg-transparent dark:bg-transparent"
					name="cause"
					bind:value={cause}
					required
				>
					<option value={''} disabled selected>
						<span class="!text-gray-500">Select Cause</span>
					</option>
					{#each filteredCauseCodes as item}
						<option value={item.id}>
							{item.name}
						</option>
					{/each}
				</select>
			</div>
		</label>

		<label class="label">
			<p class="my-2 text-base font-semibold">
				Select Solution
				<span class="text-red-500">*</span>
			</p>
			<div class="flex flex-row">
				<select
					class="select rounded-none w-full bg-transparent dark:bg-transparent"
					name="solution"
					bind:value={solution}
					required
				>
					<option value={''} disabled selected>
						<span class="!text-gray-500">Select Solution</span>
					</option>
					{#each filteredSolutionCodes as item}
						<option value={item.id}>
							{item.name}
						</option>
					{/each}
				</select>
			</div>
		</label>

		<label class="my-3 label">
			<p class="my-2 text-base font-semibold">
				Closing Remarks
				<span class="text-red-500">*</span>
			</p>

			<textarea
				class="textarea p-2 bg-transparent dark:bg-transparent"
				name="closingRemarks"
				type="text"
				bind:value={closingRemarks}
				rows="2"
				placeholder="Please provide a closing remark"
				required
			/>
		</label>

		<div class="flex justify-between items-center mt-5">
			<button
				type="button"
				class="btn variant-outline"
				on:click={() => modalStore.close()}
				disabled={loading}
			>
				Close
			</button>

			<button type="submit" class="btn variant-filled" disabled={loading}> Submit </button>
		</div>
	</form>
</div>
