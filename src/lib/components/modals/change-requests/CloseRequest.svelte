<script>
	import { superForm, defaults, fileProxy } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { getToastStore, getModalStore } from '@skeletonlabs/skeleton';
	import { changeRequestSchema } from '$lib/schemas/changeRequestSchema';
	import { updateRequest } from '$lib/api/changeRequests';
	import SpinnerOverlay from '$lib/components/layout/SpinnerOverlay.svelte';

	const toastStore = getToastStore();
	const modalStore = getModalStore();
	const request = $modalStore[0].meta.request;
	const zodForm = zod(
		changeRequestSchema($modalStore[0].meta.attachment, request.startDate, request.endDate)
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
				await updateRequest(request.id, form.data);
				modalStore.close();

				toastStore.trigger({
					type: 'success',
					message: 'Request Updated Successfully!',
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

	const closingAttachment = fileProxy(form, 'closingAttachment');

	$: {
		$form.title = request.title;
		$form.objective = request.objective;
		$form.serviceImpact = request.serviceImpact;
		$form.siteId = request.siteId;
		$form.involvedSystem = request.involvedSystem;
		$form.teamIds = request.teamIds;
		$form.summary = request.summary;
		$form.servicesListIds = request.servicesListIds;
		$form.awarenessToBeMade = request.awarenessToBeMade;
		$form.requestee = request?.requestee;
		$form.changeTeamId = request?.changeTeamId;
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
			Closing Request
			<br />
			<span class="font-bold text-primary-500 dark:text-tertiary-500">{request.ticketNumber}</span>
		</h3>

		<div>
			<form method="POST" enctype="multipart/form-data" use:enhance>
				<div class="flex flex-col justify-between gap-4">
					<div class="grid grid-cols-2 auto-rows-auto gap-4">
						<label class="label">
							<p class="my-2 text-base font-semibold">
								CR Submission within 5 Days
								<span class="text-red-500">*</span>
							</p>
							<div class="flex flex-row">
								<select
									class="select rounded-none w-full"
									name="submissionWithinFiveDays"
									bind:value={$form.submissionWithinFiveDays}
									required
									{...$constraints.submissionWithinFiveDays}
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

								{#if $errors.submissionWithinFiveDays}
									<span class=" text-error-500">{$errors.submissionWithinFiveDays}</span>
								{/if}
							</div>
						</label>

						<label class="label">
							<p class="my-2 text-base font-semibold">
								Duration of the CR is adhered to
								<span class="text-red-500">*</span>
							</p>
							<div class="flex flex-row">
								<select
									class="select rounded-none w-full"
									name="durationAdhered"
									bind:value={$form.durationAdhered}
									required
									{...$constraints.durationAdhered}
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

								{#if $errors.durationAdhered}
									<span class=" text-error-500">{$errors.durationAdhered}</span>
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

						<label class="label">
							<p class="my-2 text-base font-semibold">
								Correct list of Customers Submitted
								<span class="text-red-500">*</span>
							</p>
							<div class="flex flex-row">
								<select
									class="select rounded-none w-full"
									name="correctCustomerList"
									bind:value={$form.correctCustomerList}
									required
									{...$constraints.correctCustomerList}
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

								{#if $errors.correctCustomerList}
									<span class=" text-error-500">{$errors.correctCustomerList}</span>
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

						{#if specifyBeforeClosing}
							<label class="label col-span-2">
								<p class="my-2 text-base font-semibold">
									Closing Remarks
									<span class="text-red-500">*</span>
								</p>

								<textarea
									class="textarea p-2 bg-transparent dark:bg-transparent"
									name="closingRemarks"
									type="text"
									bind:value={$form.closingRemarks}
									rows="2"
									placeholder="Please provide a closing remark"
									required={specifyBeforeClosing}
									{...$constraints.closingRemarks}
								/>

								{#if $errors.closingRemarks}
									<span class=" text-error-500">{$errors.closingRemarks}</span>
								{/if}
							</label>

							<div class="flex flex-col col-span-2">
								<label class="my-2 text-base font-semibold" for="closingAttachment">
									Upload Closing Attachment
									<span class="text-red-500">*</span>
								</label>

								{#if $errors.closingAttachment}
									<span class=" text-error-500">{$errors.closingAttachment}</span>
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
								Close Request
							</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
