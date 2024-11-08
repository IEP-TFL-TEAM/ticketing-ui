<script>
	import { superForm, defaults, fileProxy, dateProxy } from 'sveltekit-superforms';
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
				let message = 'Please verify that all rquired fields are provided.';
				form.message = message;

				toastStore.trigger({
					message,
					background: 'variant-filled-error',
					classes: 'rounded-none font-semibold'
				});
				return { form };
			}

			try {
				form.data.status = 'CLOSED';
				await updateRoutineMaintenance(routine.id, form.data);
				modalStore.close();

				toastStore.trigger({
					type: 'success',
					message: 'Routine Closed Successfully!',
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

	const attachment = fileProxy(form, 'attachment');
	const closingAttachment = fileProxy(form, 'closingAttachment');

	$: startDateVal = dateProxy(form, 'startDate', { format: 'datetime-local', empty: 'null' });
	$: endDateVal = dateProxy(form, 'endDate', { format: 'datetime-local', empty: 'null' });

	$: {
		$form.title = routine.title;
		$form.objective = routine.objective;
		$form.scopeOfWork = routine.scopeOfWork;
		$form.siteId = routine.siteId;
		$form.regionId = routine.regionId;
		$form.areaId = routine.areaId;
		$form.serviceImpact = routine.serviceImpact;
		$form.teamIds = routine.teamIds;
		$form.duration = routine.duration;
		$form.servicesListIds = routine.servicesListIds;
		$form.requestee = routine?.requestee;
		$form.maintenanceTeamId = routine?.maintenanceTeamId;
	}

	$: specifyBeforeClosing = !$form.taskCompletion || $form.taskCompletion === 'Yes' ? false : true;
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
						{#if routine.endDate.length === 0}
							<label class="label col-span-2">
								<p class="my-2 text-base font-semibold">
									Enter End Date
									<span class="text-red-500">*</span>
								</p>
								<div class="flex flex-row">
									<input
										type="datetime-local"
										name="endDate"
										bind:value={$endDateVal}
										min={$startDateVal}
										required={routine.endDate.length === 0}
										class="input p-4 border bg-white dark:bg-gradient-to-r dark:from-black/10 dark:to-neutral-300/80"
										{...$constraints.endDate}
									/>
								</div>

								{#if $errors.endDate}
									<span class="mt-2 text-error-500">{$errors.endDate}</span>
								{/if}
							</label>
						{/if}

						{#if routine.attachment.length === 0}
							<div class="flex flex-col col-span-2">
								<label class="mt-2 text-base font-semibold" for="attachment">
									Upload Attachment
									<span class="text-red-500">*</span>
								</label>

								{#if $errors.attachment}
									<span class="mt-2 text-error-500">{$errors.attachment}</span>
								{/if}

								<p class="my-2 text-sm font-semibold text-primary-500 dark:text-tertiary-500">
									Max file upload 5 (MB)
								</p>

								<input
									class="w-full rounded text-base text-gray-900 border border-gray-300 dark:border-gray-700 cursor-pointer bg-gray-50 dark:bg-transparent dark:text-white focus:outline-none p-1"
									name="attachment"
									bind:files={$attachment}
									type="file"
									required={routine.attachment.length === 0}
									{...$constraints.attachment}
								/>
							</div>
						{/if}

						{#if routine.endDate.length === 0 || routine.attachment.length === 0}
							<hr class="!border-gray-200 dark:!border-gray-200/30 my-5 col-span-2" />
						{/if}

						<label class="label">
							<p class="my-2 text-base font-semibold">
								All related alarms cleared
								<span class="text-red-500">*</span>
							</p>
							<div class="flex flex-row">
								<select
									class="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm rounded focus:ring-primary-500 p-4 w-full"
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
									<span class="mt-2 text-error-500">{$errors.alarmsCleared}</span>
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
									class="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm rounded focus:ring-primary-500 p-4 w-full"
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
									<span class="mt-2 text-error-500">{$errors.serviceImpactCorrect}</span>
								{/if}
							</div>
						</label>

						<label class="label col-span-2">
							<p class="my-2 text-base font-semibold">
								Completion of Task
								<span class="text-red-500">*</span>
							</p>
							<div class="flex flex-row">
								<select
									class="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm rounded focus:ring-primary-500 p-4 w-full"
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
									<span class="mt-2 text-error-500">{$errors.taskCompletion}</span>
								{/if}
							</div>
						</label>

						{#if specifyBeforeClosing}
							<label class="label col-span-2">
								<p class="my-2 text-base font-semibold">
									Closing Remarks
									<span class="text-red-500">*</span>
								</p>

								<textarea
									class="textarea border border-black/20 p-2 bg-transparent dark:bg-transparent"
									name="closingRemarks"
									type="text"
									bind:value={$form.closingRemarks}
									rows="2"
									placeholder="Please provide a closing remark"
									required={specifyBeforeClosing}
									{...$constraints.closingRemarks}
								/>

								{#if $errors.closingRemarks}
									<span class="mt-2 text-error-500">{$errors.closingRemarks}</span>
								{/if}
							</label>

							<div class="flex flex-col col-span-2">
								<label class="my-2 text-base font-semibold" for="closingAttachment">
									Upload Closing Attachment
									<span class="text-red-500">*</span>
								</label>

								{#if $errors.closingAttachment}
									<span class="mt-2 text-error-500">{$errors.closingAttachment}</span>
								{/if}

								<p class="mb-2 text-sm font-semibold text-primary-500 dark:text-tertiary-500">
									Max file upload 5 (MB)
								</p>

								<input
									class="w-full rounded text-base text-gray-900 border border-gray-300 dark:border-gray-700 cursor-pointer bg-gray-50 dark:bg-transparent dark:text-white focus:outline-none p-1"
									name="closingAttachment"
									bind:files={$closingAttachment}
									required={specifyBeforeClosing}
									type="file"
									{...$constraints.closingAttachment}
								/>
							</div>
						{/if}
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
