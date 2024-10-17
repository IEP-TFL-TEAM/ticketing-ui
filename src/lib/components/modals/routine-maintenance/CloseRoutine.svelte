<script>
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { getToastStore, getModalStore } from '@skeletonlabs/skeleton';
	import SpinnerOverlay from '$lib/components/layout/SpinnerOverlay.svelte';
	import { routineMaintenanceSchema } from '$lib/schemas/routineMaintenanceSchema';
	import { updateRoutineMaintenance } from '$lib/api/routineMaintenance';

	const toastStore = getToastStore();
	const modalStore = getModalStore();
	const routine = $modalStore[0].meta.routine;
	const zodForm = zod(
		routineMaintenanceSchema($modalStore[0].meta.attachment, routine.startDate, routine.endDate)
	);
	const originalForm = defaults(zodForm);

	let submitting = false;

	const { form, constraints, enhance, message, errors, delayed } = superForm(originalForm, {
		SPA: true,
		taintedMessage: 'Are you sure you want to leave?',
		multipleSubmits: 'prevent',
		validators: zodForm,
		async onUpdate({ form }) {
			submitting = true;

			if (!form.valid) {
				form.valid = false;
				submitting = false;
				form.message = 'Please verify that all rquired fields are provided.';

				toastStore.trigger({
					message: 'Please verify that all rquired fields are provided.',
					background: 'variant-filled-error',
					classes: 'rounded-none font-semibold'
				});
				return { form };
			}

			try {
				form.data.isClosed = true;
				await updateRoutineMaintenance(routine.id, form.data);
				modalStore.close();

				toastStore.trigger({
					type: 'success',
					message: 'Routine Updated Successfully!',
					background: 'variant-filled-success',
					classes: 'rounded-none font-semibold'
				});
			} catch (e) {
				form.valid = false;
				submitting = false;
				console.error(e);

				toastStore.trigger({
					message: 'Oops, something went wrong',
					background: 'variant-filled-error',
					classes: 'rounded-none font-semibold'
				});

				return { form };
			}

			submitting = false;
		}
	});

	$: {
		$form.title = routine.title;
		$form.objective = routine.objective;
		$form.scopeOfWork = routine.scopeOfWork;
		$form.siteId = routine.siteId;
		$form.serviceImpact = routine.serviceImpact;
		$form.teamIds = routine.teamIds;
		$form.duration = routine.duration;
		$form.listOfServices = routine.listOfServices;
		$form.requestee = routine?.requestee;
		$form.maintenanceTeamId = routine?.maintenanceTeamId;
	}
</script>

{#if $delayed || submitting}
	<SpinnerOverlay />
{/if}

<div
	class="max-h-[50rem] w-full max-w-2xl p-8 bg-white border rounded shadow border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 max-xl:m-20 my-10 overflow-y-auto"
>
	<div class="flex flex-col gap-2">
		<h3 class="text-center text-black h3 dark:text-white">
			Closing Routine
			<br />
			<span class="font-bold text-primary-500 dark:text-tertiary-500">{routine.ticketNumber}</span>
		</h3>

		<div>
			<form method="POST" enctype="multipart/form-data" use:enhance>
				<div class="flex flex-col justify-between gap-4">
					<div class="grid grid-cols-2 auto-rows-auto gap-4">
						<label class="label col-span-2">
							<p class="my-2 text-base font-semibold">
								Completion of Task
								<span class="text-red-500">*</span>
							</p>
							<div class="flex flex-row">
								<select
									class="select rounded-none w-full"
									name="taskCompletion"
									bind:value={$form.taskCompletion}
									required
									{...$constraints.taskCompletion}
								>
									<option value={null} disabled selected>
										<span class="!text-gray-500">Select Option</span>
									</option>
									{#each ['Yes', 'No', 'Partially Completed'] as item}
										<option value={item}>
											{item}
										</option>
									{/each}
								</select>

								{#if $errors.taskCompletion}
									<span class=" text-error-500">{$errors.taskCompletion}</span>
								{/if}
							</div>
						</label>

						<label class="label">
							<p class="my-2 text-base font-semibold">
								All related alarms cleared
								<span class="text-red-500">*</span>
							</p>
							<div class="flex flex-row">
								<select
									class="select rounded-none w-full"
									name="alarmsCleared"
									bind:value={$form.alarmsCleared}
									required
									{...$constraints.alarmsCleared}
								>
									<option value={null} disabled selected>
										<span class="!text-gray-500">Select Option</span>
									</option>
									{#each ['Yes', 'No', 'Alarms Outstanding'] as item}
										<option value={item}>
											{item}
										</option>
									{/each}
								</select>

								{#if $errors.alarmsCleared}
									<span class=" text-error-500">{$errors.alarmsCleared}</span>
								{/if}
							</div>
						</label>

						<label class="label">
							<p class="my-2 text-base font-semibold">
								Service Impact is Correct
								<span class="text-red-500">*</span>
							</p>
							<div class="flex flex-row">
								<select
									class="select rounded-none w-full"
									name="serviceImpactCorrect"
									bind:value={$form.serviceImpactCorrect}
									required
									{...$constraints.serviceImpactCorrect}
								>
									<option value={null} disabled selected>
										<span class="!text-gray-500">Select Option</span>
									</option>
									{#each ['Yes', 'No'] as item}
										<option value={item}>
											{item}
										</option>
									{/each}
								</select>

								{#if $errors.serviceImpactCorrect}
									<span class=" text-error-500">{$errors.serviceImpactCorrect}</span>
								{/if}
							</div>
						</label>
					</div>

					<div class="mt-8 flex flex-col items-center gap-y-4">
						{#if $message}
							<span class="text-error-500 font-bold uppercase text-center">{$message}</span>
						{/if}

						<div class="flex justify-between items-center gap-2">
							<button type="button" class="btn variant-outline" on:click={() => modalStore.close()}>
								Cancel
							</button>

							<button
								type="submit"
								class="w-40 font-semibold text-white uppercase rounded btn variant-filled-primary dark:variant-filled-tertiary max-lg:w-full"
								disabled={submitting}
							>
								Close Routine
							</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
