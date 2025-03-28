<script>
	import { superForm, defaults, fileProxy, dateProxy } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { getToastStore, getModalStore } from '@skeletonlabs/skeleton';
	import { routineMaintenanceSchema } from '$lib/schemas/routineMaintenanceSchema';
	import { updateRoutineMaintenance } from '$lib/api/routineMaintenance';
	import SpinnerOverlay from '$lib/components/layout/SpinnerOverlay.svelte';

	const toastStore = getToastStore();
	const modalStore = getModalStore();
	const routine = $modalStore[0].meta.routine;
	const zodForm = zod(
		routineMaintenanceSchema($modalStore[0].meta.attachment, routine.startDate, routine.endDate)
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

	const attachment = fileProxy(form, 'attachment');

	$: startDateVal = dateProxy(form, 'startDate', { format: 'datetime-local', empty: 'null' });
	$: endDateVal = dateProxy(form, 'endDate', { format: 'datetime-local', empty: 'null' });

	$: {
		$form.requestee = routine.requestee;
		$form.title = routine.title;
		$form.objective = routine.objective;
		$form.riskAversion = routine.riskAversion;
		$form.serviceImpact = routine.serviceImpact;
		$form.duration = routine.duration;
		$form.siteId = routine.siteId;
		$form.regionId = routine.regionId;
		$form.areaId = routine.areaId;
		$form.teamIds = routine.teamIds;
		$form.maintenanceTeamId = routine.maintenanceTeamId;
		$form.servicesListIds = routine.servicesListIds;
		$form.scopeOfWork = routine.scopeOfWork;
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
			<span class="font-bold text-primary-500 dark:text-tertiary-500">{routine.ticketNumber}</span>
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
									class="input p-4 border bg-white dark:bg-gradient-to-r dark:from-black/10 dark:to-neutral-300/80"
									{...$constraints.startDate}
								/>
							</div>

							{#if $errors.startDate}
								<span class="mt-2 text-error-500">{$errors.startDate}</span>
							{/if}
						</label>

						<label class="label">
							<p class="my-2 text-base font-semibold">Enter End Date</p>
							<div class="flex flex-row">
								<input
									type="datetime-local"
									name="endDate"
									bind:value={$endDateVal}
									min={$startDateVal}
									on:change={() => (dirtyForm = true)}
									class="input p-4 border bg-white dark:bg-gradient-to-r dark:from-black/10 dark:to-neutral-300/80"
									{...$constraints.endDate}
								/>
							</div>

							{#if $errors.endDate}
								<span class="mt-2 text-error-500">{$errors.endDate}</span>
							{/if}
						</label>
					</div>

					<div class="flex flex-col">
						<div class="flex flex-col mb-4">
							<label class="mt-2 text-base font-semibold" for="attachment">
								Upload Attachment
							</label>

							{#if routine.attachment.length > 0}
								<div class="mt-2">
									<span class="text-sm underline break-words">
										{routine.attachment}
									</span> (current)
								</div>
							{/if}
						</div>

						{#if $errors.attachment}
							<span class="mt-2 text-error-500">{$errors.attachment}</span>
						{/if}

						<p class="mb-2 text-sm font-semibold text-primary-500 dark:text-tertiary-500">
							Max file upload 5 (MB)
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
							class="w-40 font-semibold text-white uppercase rounded btn variant-filled-primary dark:variant-filled-tertiary max-lg:w-full"
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
