<script>
	import { superForm, defaults, fileProxy, dateProxy } from 'sveltekit-superforms';
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
	let dirtyForm = false;

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

	const attachment = fileProxy(form, 'attachment');

	$: startDateVal = dateProxy(form, 'startDate', { format: 'datetime-local', empty: 'null' });
	$: endDateVal = dateProxy(form, 'endDate', { format: 'datetime-local', empty: 'null' });

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
</script>

{#if $delayed || submitting}
	<SpinnerOverlay />
{/if}

<div
	class="max-h-[50rem] w-full max-w-5xl p-8 bg-white border rounded shadow border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 max-xl:m-20 my-10 overflow-y-auto"
>
	<div class="flex flex-col gap-2">
		<h3 class="text-center text-black h3 dark:text-white">
			Updating
			<br />
			<span class="font-bold text-primary-500 dark:text-secondary-500">{request.ticketNumber}</span>
		</h3>

		<div>
			<form method="POST" enctype="multipart/form-data" use:enhance>
				<div class="flex flex-col justify-between gap-4">
					<div class="grid grid-cols-2 auto-rows-auto gap-4">
						<label class="label">
							<p class="my-2 text-base font-semibold">
								Enter Start Date
								<span class="text-red-500">*</span>
							</p>
							<div class="flex flex-row">
								<input
									type="datetime-local"
									name="startDate"
									bind:value={$startDateVal}
									on:change={() => (dirtyForm = true)}
									required
									class="input p-4 border"
									{...$constraints.startDate}
								/>
							</div>

							{#if $errors.startDate}
								<span class=" text-error-500">{$errors.startDate}</span>
							{/if}
						</label>

						<label class="label">
							<p class="my-2 text-base font-semibold">
								Enter End Date
								<span class="text-red-500">*</span>
							</p>
							<div class="flex flex-row">
								<input
									type="datetime-local"
									name="endDate"
									bind:value={$endDateVal}
									on:change={() => (dirtyForm = true)}
									required
									class="input p-4 border"
									{...$constraints.endDate}
								/>
							</div>

							{#if $errors.endDate}
								<span class=" text-error-500">{$errors.endDate}</span>
							{/if}
						</label>
					</div>

					<div class="flex flex-col">
						<div class="flex flex-col mb-4">
							<label class="my-2 text-base font-semibold" for="attachment">
								Upload Attachment
								<span class="text-red-500">*</span>
							</label>

							<div>
								<span class="text-sm underline break-words">
									{request.attachment}
								</span> (current)
							</div>
						</div>

						{#if $errors.attachment}
							<span class=" text-error-500">{$errors.attachment}</span>
						{/if}

						<p class="mb-2 text-sm font-semibold text-primary-500 dark:text-tertiary-500">
							Allowed Formats: .doc, .docx, .pdf, .jpg, .png only.
						</p>

						<input
							class="w-full rounded text-base text-gray-900 border border-gray-300 dark:border-gray-700 cursor-pointer bg-gray-50 dark:bg-transparent dark:text-white focus:outline-none p-1"
							name="attachment"
							bind:files={$attachment}
							on:change={() => (dirtyForm = true)}
							type="file"
							{...$constraints.attachment}
						/>
					</div>

					<div class="mt-8 flex flex-col items-center gap-y-4">
						{#if $message}
							<span class="text-error-500 font-bold uppercase text-center">{$message}</span>
						{/if}

						<button
							type="submit"
							class="w-40 font-semibold text-white uppercase rounded btn variant-filled-primary dark:variant-filled-secondary max-lg:w-full"
							disabled={submitting || !dirtyForm}
						>
							Submit
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
