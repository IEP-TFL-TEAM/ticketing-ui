<script>
	import { superForm, defaults, fileProxy, dateProxy } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { getToastStore, getDrawerStore } from '@skeletonlabs/skeleton';
	import { changeRequestSchema } from '$lib/schemas/changeRequestSchema';
	import { createRequest } from '$lib/api/changeRequests';
	import SpinnerOverlay from '$lib/components/layout/SpinnerOverlay.svelte';

	export const onCompleteHandler = () => submit();

	export let staffId, teamIds, cteamId, siteId;

	const toastStore = getToastStore();
	const drawerStore = getDrawerStore();

	let submitting = false;
	const originalForm = defaults(zod(changeRequestSchema()));

	const { form, constraints, enhance, message, errors, delayed, submit } = superForm(originalForm, {
		SPA: true,
		taintedMessage: 'Are you sure you want to leave?',
		multipleSubmits: 'prevent',
		validators: zod(changeRequestSchema()),
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
				await createRequest(form.data);
				drawerStore.close();

				toastStore.trigger({
					type: 'success',
					message: 'Request Created Successfully!',
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
		$form.changeTeamId = cteamId;
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

					{#if $errors.date}
						<span class=" text-error-500">{$errors.date}</span>
					{/if}
				</label>

				<label class="label">
					<p class="my-2 text-base font-semibold">
						Enter Title of the Change Request
						<span class="text-red-500">*</span>
					</p>
					<div class="flex flex-row">
						<input
							class="input p-4 border"
							type="text"
							name="title"
							bind:value={$form.title}
							placeholder="Please enter request title"
							{...$constraints.title}
						/>
					</div>

					{#if $errors.title}
						<span class=" text-error-500">{$errors.title}</span>
					{/if}
				</label>

				<label class="label">
					<p class="my-2 text-base font-semibold">
						Enter Objective of the Change Request
						<span class="text-red-500">*</span>
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
						Enter System Involved
						<span class="text-red-500">*</span>
					</p>
					<div class="flex flex-row">
						<input
							class="input p-4 border"
							type="text"
							name="involvedSystem"
							bind:value={$form.involvedSystem}
							placeholder="Please Involved System"
							{...$constraints.involvedSystem}
						/>
					</div>

					{#if $errors.involvedSystem}
						<span class=" text-error-500">{$errors.involvedSystem}</span>
					{/if}
				</label>

				<label class="label">
					<p class="my-2 text-base font-semibold">Enter Brief Summary of CR</p>

					<p class="mb-4 text-sm font-semibold text-primary-500 dark:text-tertiary-500">
						(Background of the CR – Why you are performing this CR? Need for the CR?)
					</p>

					<div class="flex flex-row">
						<textarea
							class="textarea p-2"
							name="summary"
							bind:value={$form.summary}
							placeholder="Type here ..."
							type="text"
							rows="2"
							{...$constraints.summary}
						/>
					</div>

					{#if $errors.summary}
						<span class=" text-error-500">{$errors.summary}</span>
					{/if}
				</label>

				<label class="label">
					<p class="my-2 text-base font-semibold">Enter CR Method of Procedure – Scope of Work</p>

					<p class="mb-4 text-sm font-semibold text-primary-500 dark:text-tertiary-500">
						(High level scope of the work to be carried out)
					</p>

					<div class="flex flex-row">
						<textarea
							class="textarea p-2"
							name="scopeOfWork"
							bind:value={$form.scopeOfWork}
							placeholder="Type here ..."
							type="text"
							rows="2"
							{...$constraints.scopeOfWork}
						/>
					</div>

					{#if $errors.scopeOfWork}
						<span class=" text-error-500">{$errors.scopeOfWork}</span>
					{/if}
				</label>

				<label class="label">
					<p class="my-2 text-base font-semibold">Enter CR Risks & Mitigation</p>

					<p class="mb-4 text-sm font-semibold text-primary-500 dark:text-tertiary-500">
						(Risks associated with performing work). (What is at Risk? Who is at Risk? How are they
						at Risk?)
					</p>

					<div class="flex flex-row">
						<textarea
							class="textarea p-2"
							name="risksAndMitigations"
							bind:value={$form.risksAndMitigations}
							placeholder="Type here ..."
							type="text"
							rows="2"
							{...$constraints.risksAndMitigations}
						/>
					</div>

					{#if $errors.risksAndMitigations}
						<span class=" text-error-500">{$errors.risksAndMitigations}</span>
					{/if}
				</label>

				<label class="label">
					<p class="my-2 text-base font-semibold">Enter Roll Back Procedure</p>
					<div class="flex flex-row">
						<textarea
							class="textarea p-2"
							name="rollbackProcedures"
							bind:value={$form.rollbackProcedures}
							placeholder="Type here ..."
							type="text"
							rows="2"
							{...$constraints.rollbackProcedures}
						/>
					</div>

					{#if $errors.rollbackProcedures}
						<span class=" text-error-500">{$errors.rollbackProcedures}</span>
					{/if}
				</label>

				<label class="label">
					<p class="my-2 text-base font-semibold">Enter List of Services / Circuits</p>

					<p class="mb-4 text-sm font-semibold text-primary-500 dark:text-tertiary-500">
						(All services and circuits surrounding the CR. Affected or not affected).
					</p>

					<div class="flex flex-row">
						<textarea
							class="textarea p-2"
							name="listOfServices"
							bind:value={$form.listOfServices}
							placeholder="Type here ..."
							type="text"
							rows="2"
							{...$constraints.listOfServices}
						/>
					</div>

					{#if $errors.listOfServices}
						<span class=" text-error-500">{$errors.listOfServices}</span>
					{/if}
				</label>

				<label class="label">
					<p class="my-2 text-base font-semibold">Enter Awareness To Be Made</p>
					<div class="flex flex-row">
						<select
							class="select rounded-none w-full"
							name="awarenessToBeMade"
							bind:value={$form.awarenessToBeMade}
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
