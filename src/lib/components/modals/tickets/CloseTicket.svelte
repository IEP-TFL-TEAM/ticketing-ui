<script>
	import { onMount } from 'svelte';
	import { getCauseCodes } from '$lib/api/causeCodes';
	import { getSolutionCodes } from '$lib/api/solutionCodes';
	import pb from '$lib/api/pocketbaseClient';
	import { updateTicket } from '$lib/api/tickets';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import SpinnerOverlay from '$lib/components/layout/SpinnerOverlay.svelte';

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	const ticket = $modalStore[0].meta.ticket;

	let solutionCodes = [],
		causeCodes = [];

	onMount(async () => {
		const results = await Promise.allSettled([getCauseCodes(), getSolutionCodes()]);

		[causeCodes, solutionCodes] = results.map(({ status, value }) =>
			status === 'fulfilled' ? value : []
		);
	});

	let filteredSolutionCodes = [],
		filteredCauseCodes = [];

	$: filteredSolutionCodes = solutionCodes
		.filter((code) => code.faultTypeId === ticket.faultTypeId)
		.sort((a, b) => {
			if (a.name < b.name) return -1;
			if (a.name > b.name) return 1;
			return 0;
		});
	$: filteredCauseCodes = causeCodes.filter((code) => code.faultTypeId === ticket.faultTypeId);

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
				incidentEnd: new Date(),
				availability: getAvailability(ticket).toFixed(2)
			});
			$modalStore[0].response({ updatedTicket });

			toastStore.trigger({
				message: 'Closed Incident Successfully',
				background: 'variant-filled-success',
				classes: 'rounded-none font-semibold',
				timeout: 5000
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

	function calculateOutageDuration(createdTime, updatedTime) {
		const createdDateTime = new Date(createdTime);
		const updatedDateTime = new Date(updatedTime);

		const diffInMs = updatedDateTime - createdDateTime;
		return diffInMs / (1000 * 60);
	}

	function calculateAvailability(outageMinutes, minutesInYear = 525600) {
		return (1 - outageMinutes / minutesInYear) * 100;
	}

	function getAvailability(ticket) {
		const outageDuration = calculateOutageDuration(
			ticket.incidentStart,
			(ticket.incidentEnd = new Date())
		);
		const totalTimeInYear = 525600;

		return calculateAvailability(outageDuration, totalTimeInYear);
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
					class="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm rounded focus:ring-primary-500 p-4 w-full"
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
					class="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm rounded focus:ring-primary-500 p-4 w-full"
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
				class="textarea border border-black/20 p-2 bg-transparent dark:bg-transparent"
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
