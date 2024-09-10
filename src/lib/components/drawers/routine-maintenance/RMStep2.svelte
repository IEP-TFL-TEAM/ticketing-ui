<script>
	import { superForm, defaults, fileProxy, dateProxy } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { getToastStore, getDrawerStore } from '@skeletonlabs/skeleton';
	import { routineMaintenanceSchema } from '$lib/schemas/routineMaintenanceSchema';
	import { createRoutineMaintenance } from '$lib/api/routineMaintenance';
	import SpinnerOverlay from '$lib/components/layout/SpinnerOverlay.svelte';

	export const onCompleteHandler = () => submit();

	export let staffId, teamIds, maintenanceTeamId, siteId;

	const toastStore = getToastStore();
	const drawerStore = getDrawerStore();

	let submitting = false;
	const originalForm = defaults(zod(routineMaintenanceSchema()));

	const { form, constraints, enhance, message, errors, delayed, submit } = superForm(originalForm, {
		SPA: true,
		taintedMessage: 'Are you sure you want to leave?',
		multipleSubmits: 'prevent',
		validators: zod(routineMaintenanceSchema()),
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
				await createRoutineMaintenance(form.data);
				drawerStore.close();

				toastStore.trigger({
					type: 'success',
					message: 'Routine Created Successfully!',
					background: 'variant-filled-success',
					classes: 'rounded-none font-semibold'
				});
			} catch (e) {
				form.valid = false;
				submitting = false;

				toastStore.trigger({
					message,
					background: 'variant-filled-error',
					classes: 'rounded-none font-semibold'
				});

				form.message = e.data.data.email.message;

				return { form };
			}

			submitting = false;
		}
	});

	const attachment = fileProxy(form, 'attachment');

	$: {
		$form.requestee = staffId;
		$form.teamIds = teamIds;
		$form.maintenanceTeamId = maintenanceTeamId;
		$form.siteId = siteId;
	}

	$: dateVal = dateProxy(form, 'date', { format: 'date', empty: 'null' });
	$: startDateVal = dateProxy(form, 'startDate', { format: 'datetime-local', empty: 'null' });
	$: endDateVal = dateProxy(form, 'endDate', { format: 'datetime-local', empty: 'null' });
</script>

{#if $delayed || submitting}
	<SpinnerOverlay />
{/if}

<div class="h-full flex flex-col justify-between gap-y-4 w-full">
	<div class="flex flex-col">
		<form method="POST" enctype="multipart/form-data" use:enhance>
			<div class="flex flex-col justify-between gap-4">
				<label class="label">
					<p class="my-2 text-base font-semibold">
						Enter Date
						<span class="text-red-500">*</span>
					</p>
					<div class="flex flex-row">
						<input
							type="date"
							name="date"
							bind:value={$dateVal}
							required
							class="input p-4 border"
							{...$constraints.date}
							max={$constraints.date?.max?.toString().slice(0, 10)}
						/>
					</div>

					{#if $errors.title}
						<span class=" text-error-500">{$errors.title}</span>
					{/if}
				</label>

				<label class="label">
					<p class="my-2 text-base font-semibold">
						Enter Title
						<span class="text-red-500">*</span>
					</p>
					<div class="flex flex-row">
						<input
							class="input p-4 border"
							type="text"
							name="title"
							bind:value={$form.title}
							placeholder="Please enter routine title"
							{...$constraints.title}
						/>
					</div>

					{#if $errors.title}
						<span class=" text-error-500">{$errors.title}</span>
					{/if}
				</label>

				<label class="label">
					<p class="my-2 text-base font-semibold">
						Enter Objective
						<span class="text-red-500">*</span>
					</p>

					<p class="mb-4 text-sm font-semibold text-primary-500 dark:text-tertiary-500">
						Work Target/ Why the maintenance is being performed?
					</p>

					<div class="flex flex-row">
						<input
							class="input p-4 border"
							type="text"
							name="objective"
							bind:value={$form.objective}
							placeholder="Please enter objective"
							{...$constraints.objective}
						/>
					</div>

					{#if $errors.objective}
						<span class=" text-error-500">{$errors.objective}</span>
					{/if}
				</label>

				<label class="label">
					<p class="my-2 text-base font-semibold">
						Enter Risk Aversion
						<span class="text-red-500">*</span>
					</p>

					<p class="mb-4 text-sm font-semibold text-primary-500 dark:text-tertiary-500">
						Risks/Consequences if maintenance Work is neglected
					</p>

					<div class="flex flex-row">
						<textarea
							class="textarea p-2"
							name="riskAversion"
							bind:value={$form.riskAversion}
							placeholder="Type here ..."
							type="text"
							rows="2"
							required
							{...$constraints.riskAversion}
						/>
					</div>

					{#if $errors.riskAversion}
						<span class=" text-error-500">{$errors.riskAversion}</span>
					{/if}
				</label>

				<label class="label">
					<p class="my-2 text-base font-semibold">
						Enter Summarized Scope of Work
						<span class="text-red-500">*</span>
					</p>
					<div class="flex flex-row">
						<textarea
							class="textarea p-2"
							name="scopeOfWork"
							bind:value={$form.scopeOfWork}
							placeholder="Type here ..."
							type="text"
							rows="2"
							required
							{...$constraints.scopeOfWork}
						/>
					</div>

					{#if $errors.scopeOfWork}
						<span class=" text-error-500">{$errors.scopeOfWork}</span>
					{/if}
				</label>

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
							required
							class="input p-4 border"
							{...$constraints.endDate}
						/>
					</div>

					{#if $errors.endDate}
						<span class=" text-error-500">{$errors.endDate}</span>
					{/if}
				</label>

				<label class="label">
					<p class="my-2 text-base font-semibold">
						Service Impact
						<span class="text-red-500">*</span>
					</p>
					<div class="flex flex-row">
						<select
							class="select rounded-none w-full"
							name="serviceImpact"
							bind:value={$form.serviceImpact}
							required
							{...$constraints.serviceImpact}
						>
							<option value={''} disabled selected>
								<span class="!text-gray-500">Select Option</span>
							</option>
							{#each ['Yes', 'No'] as item}
								<option value={item}>
									{item}
								</option>
							{/each}
						</select>

						{#if $errors.serviceImpact}
							<span class=" text-error-500">{$errors.serviceImpact}</span>
						{/if}
					</div>
				</label>

				<label class="label">
					<p class="my-2 text-base font-semibold">
						Enter Impact Duration (minutes)
						<span class="text-red-500">*</span>
					</p>
					<div class="flex flex-row">
						<input
							class="input p-4 border"
							type="number"
							name="duration"
							bind:value={$form.duration}
							placeholder="Please enter duration"
							{...$constraints.duration}
						/>
					</div>

					{#if $errors.duration}
						<span class=" text-error-500">{$errors.duration}</span>
					{/if}
				</label>

				<label class="label">
					<p class="my-2 text-base font-semibold">
						Enter List of Services / Circuits (At Risk Services/Circuits)
						<span class="text-red-500">*</span>
					</p>

					<p class="mb-4 text-sm font-semibold text-primary-500 dark:text-tertiary-500">
						List all services surrounding the work. Non-service affecting or service affecting
					</p>

					<div class="flex flex-row">
						<textarea
							class="textarea p-2"
							name="listOfServices"
							bind:value={$form.listOfServices}
							placeholder="Type here ..."
							type="text"
							rows="2"
							required
							{...$constraints.listOfServices}
						/>
					</div>

					{#if $errors.listOfServices}
						<span class=" text-error-500">{$errors.listOfServices}</span>
					{/if}
				</label>

				<label class="label">
					<p class="my-2 text-base font-semibold">
						Enter Awareness To Be Made
						<span class="text-red-500">*</span>
					</p>
					<div class="flex flex-row">
						<select
							class="select rounded-none w-full"
							name="awarenessToBeMade"
							bind:value={$form.awarenessToBeMade}
							required
							{...$constraints.awarenessToBeMade}
						>
							<option value={''} disabled selected>
								<span class="!text-gray-500">Select Option</span>
							</option>
							{#each ['No', 'Internal', 'External', 'Media'] as item}
								<option value={item}>
									{item}
								</option>
							{/each}
						</select>

						{#if $errors.awarenessToBeMade}
							<span class=" text-error-500">{$errors.awarenessToBeMade}</span>
						{/if}
					</div>
				</label>

				<label class="label">
					<p class="my-2 text-base font-semibold">
						Enter Maintenance Risks
						<span class="text-red-500">*</span>
					</p>

					<p class="mb-4 text-sm font-semibold text-primary-500 dark:text-tertiary-500">
						What is at Risk? Who is at Risk? How are they at Risk?
					</p>

					<div class="flex flex-row">
						<textarea
							class="textarea p-2"
							name="maintenanceRisks"
							bind:value={$form.maintenanceRisks}
							placeholder="Type here ..."
							type="text"
							rows="2"
							required
							{...$constraints.maintenanceRisks}
						/>
					</div>

					{#if $errors.maintenanceRisks}
						<span class=" text-error-500">{$errors.maintenanceRisks}</span>
					{/if}
				</label>

				<label class="label">
					<p class="my-2 text-base font-semibold">
						Enter Maintenance Pre-Checklist
						<span class="text-red-500">*</span>
					</p>
					<div class="flex flex-row">
						<textarea
							class="textarea p-2"
							name="maintenancePreChecklist"
							bind:value={$form.maintenancePreChecklist}
							placeholder="Type here ..."
							type="text"
							rows="2"
							required
							{...$constraints.maintenancePreChecklist}
						/>
					</div>

					{#if $errors.maintenancePreChecklist}
						<span class=" text-error-500">{$errors.maintenancePreChecklist}</span>
					{/if}
				</label>

				<label class="label">
					<p class="my-2 text-base font-semibold">
						Enter Maintenance Outcome
						<span class="text-red-500">*</span>
					</p>
					<div class="flex flex-row">
						<textarea
							class="textarea p-2"
							name="maintenanceOutcome"
							bind:value={$form.maintenanceOutcome}
							placeholder="Type here ..."
							type="text"
							rows="2"
							required
							{...$constraints.maintenanceOutcome}
						/>
					</div>

					{#if $errors.maintenanceOutcome}
						<span class=" text-error-500">{$errors.maintenanceOutcome}</span>
					{/if}
				</label>

				<div class="flex flex-col">
					<label class="my-2 text-base font-semibold" for="attachment">
						Upload Attachment
						<span class="text-red-500">*</span>
					</label>

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
						required
						type="file"
						accept=".doc, .docx, .pdf, image/jpg, image/png, image/jpeg"
						{...$constraints.attachment}
					/>
				</div>
			</div>
		</form>
	</div>
</div>
