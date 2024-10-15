<script>
	import { superForm, defaults, fileProxy, dateProxy } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { getToastStore, getDrawerStore } from '@skeletonlabs/skeleton';
	import { ticketSchema } from '$lib/schemas/ticketSchema';
	import { createTicket } from '$lib/api/tickets';
	import SpinnerOverlay from '$lib/components/layout/SpinnerOverlay.svelte';

	export const onCompleteHandler = () => submit();

	export let teamIds, catId, catLevelId, equipIds, regionId, areaId, siteId;

	const toastStore = getToastStore();
	const drawerStore = getDrawerStore();

	const faultTypeList = $drawerStore.meta.faultTypeList;
	const causeCodes = $drawerStore.meta.causeCodes;
	const technicians = $drawerStore.meta.technicians;

	let filteredCauseCodes = [];

	let submitting = false;
	const originalForm = defaults(zod(ticketSchema()));

	const { form, constraints, enhance, message, errors, delayed, submit } = superForm(originalForm, {
		SPA: true,
		taintedMessage: 'Are you sure you want to leave?',
		multipleSubmits: 'prevent',
		validators: zod(ticketSchema()),
		async onUpdate({ form }) {
			submitting = true;

			if (!form.valid) {
				form.valid = false;
				submitting = false;
				form.message = 'Please verify that all rquired fields are provided.';

				toastStore.trigger({
					message: 'Please verify that all rquired fields are provided.',
					background: 'variant-filled-error',
					classes: 'rounded-none font-semibold',
					timeout: 3000
				});
				return { form };
			}

			try {
				await createTicket(form.data);
				drawerStore.close();

				toastStore.trigger({
					type: 'success',
					message: 'Ticket Created Successfully!',
					background: 'variant-filled-success',
					classes: 'rounded-none font-semibold',
					timeout: 3000
				});
			} catch (e) {
				form.valid = false;
				submitting = false;

				toastStore.trigger({
					message,
					background: 'variant-filled-error',
					classes: 'rounded-none font-semibold',
					timeout: 3000
				});

				form.message = e.data.data.email.message;

				return { form };
			}

			submitting = false;
		}
	});

	const attachment = fileProxy(form, 'attachment');

	$: incidentStartVal = dateProxy(form, 'incidentStart', {
		format: 'datetime-local',
		empty: 'null'
	});

	$: {
		$form.teamIds = teamIds;
		$form.categoryId = catId;
		$form.categoryLevelId = catLevelId;
		$form.teamEquipmentIds = equipIds;
		$form.regionId = regionId;
		$form.areaId = areaId;
		$form.siteId = siteId;

		filteredCauseCodes = causeCodes.filter((code) => code.faultTypeId === $form.faultTypeId);
	}
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
						Enter Starting Date and Time
						<span class="text-red-500">*</span>
					</p>
					<div class="flex flex-row">
						<input
							type="datetime-local"
							name="incidentStart"
							bind:value={$incidentStartVal}
							required
							class="input p-4 border"
							{...$constraints.incidentStart}
						/>
					</div>

					{#if $errors.incidentStart}
						<span class=" text-error-500">{$errors.incidentStart}</span>
					{/if}
				</label>

				<label class="label">
					<p class="my-2 text-base font-semibold">
						Enter Title for the Incident
						<span class="text-red-500">*</span>
					</p>
					<div class="flex flex-row">
						<input
							class="input p-4 border"
							type="text"
							name="title"
							bind:value={$form.title}
							placeholder="Please enter ticket title"
							{...$constraints.title}
						/>
					</div>

					{#if $errors.title}
						<span class=" text-error-500">{$errors.title}</span>
					{/if}
				</label>

				<label class="label">
					<p class="my-2 text-base font-semibold">
						Enter Description for the Incident
						<span class="text-red-500">*</span>
					</p>
					<div class="flex flex-row">
						<input
							class="input p-4 border"
							type="text"
							name="description"
							bind:value={$form.description}
							placeholder="Please enter ticket description"
							{...$constraints.description}
						/>
					</div>

					{#if $errors.description}
						<span class=" text-error-500">{$errors.description}</span>
					{/if}
				</label>

				<label class="label">
					<p class="my-2 text-base font-semibold">
						Select Technician
						<span class="text-red-500">*</span>
					</p>
					<div class="flex flex-row">
						<select
							class="select rounded-none w-full"
							name="technicianId"
							bind:value={$form.technicianId}
							required
							{...$constraints.technicianId}
						>
							<option value={''} disabled selected>
								<span class="!text-gray-500">Select Technician</span>
							</option>
							{#each technicians as item}
								<option value={item.id}>
									{item.name}
								</option>
							{/each}
						</select>

						{#if $errors.technicianId}
							<span class=" text-error-500">{$errors.technicianId}</span>
						{/if}
					</div>
				</label>

				<label class="label">
					<p class="my-2 text-base font-semibold">
						Select Fault Type
						<span class="text-red-500">*</span>
					</p>
					<div class="flex flex-row">
						<select
							class="select rounded-none w-full"
							name="faultTypeId"
							bind:value={$form.faultTypeId}
							required
							{...$constraints.faultTypeId}
						>
							<option value={''} disabled selected>
								<span class="!text-gray-500">Select Fault Type</span>
							</option>
							{#each faultTypeList as type}
								<option value={type.id}>
									{type.name}
								</option>
							{/each}
						</select>

						{#if $errors.faultTypeId}
							<span class=" text-error-500">{$errors.faultTypeId}</span>
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
