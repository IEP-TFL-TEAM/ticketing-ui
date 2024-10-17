<script>
	import { superForm, defaults, fileProxy, dateProxy } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { getToastStore, getDrawerStore } from '@skeletonlabs/skeleton';
	import { changeRequestSchema } from '$lib/schemas/changeRequestSchema';
	import { createRequest } from '$lib/api/changeRequests';
	import SpinnerOverlay from '$lib/components/layout/SpinnerOverlay.svelte';
	import { awarenessStatuses } from '$lib/utils';

	export function onCompleteHandler() {
		submit();
	}

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

	$: startDateVal = dateProxy(form, 'startDate', { format: 'datetime-local', empty: 'null' });
	$: endDateVal = dateProxy(form, 'endDate', { format: 'datetime-local', empty: 'null' });
</script>

{#if $delayed || submitting}
	<SpinnerOverlay />
{/if}

<div class="h-full flex flex-col justify-between gap-y-4 w-full">
	<div class="flex flex-col">
		<!-- <SuperDebug data={$form} /> -->

		<form method="POST" enctype="multipart/form-data" use:enhance>
			<div class="flex flex-col justify-between gap-4">
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
					<p class="my-2 text-base font-semibold">
						Brief Summary of CR
						<span class="text-red-500">*</span>
					</p>

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
							required
							{...$constraints.summary}
						/>
					</div>

					{#if $errors.summary}
						<span class=" text-error-500">{$errors.summary}</span>
					{/if}
				</label>

				<label class="label">
					<p class="my-2 text-base font-semibold">
						List of Services / Circuits
						<span class="text-red-500">*</span>
					</p>

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
							{#each awarenessStatuses as item}
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
