<script>
	import { superForm, defaults, fileProxy, dateProxy } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { getToastStore, getDrawerStore, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { ticketSchema } from '$lib/schemas/ticketSchema';
	import { createTicket, sendTicketCreationNotification } from '$lib/api/tickets';
	import { parseDateAndTime } from '$lib/utils/parsers';

	import SpinnerOverlay from '$lib/components/layout/SpinnerOverlay.svelte';

	export async function onCompleteHandler(e) {
		await submit();
	}

	export let teamIds,
		departmentIds,
		catId,
		catLevelId,
		equipIds,
		regionId,
		areaId,
		siteId,
		teamEmails;

	const toastStore = getToastStore();
	const drawerStore = getDrawerStore();

	const faultTypeList = $drawerStore.meta.faultTypeList;
	const technicians = $drawerStore.meta.technicians;
	const servicesList = $drawerStore.meta.servicesList;
	const servicesListOptions = servicesList
		.map((item) => ({
			label: item.name,
			value: item.id
		}))
		.sort((a, b) => {
			if (a.label < b.label) return -1;
			if (a.label > b.label) return 1;
			return 0;
		});

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
				let message = 'Please verify that all rquired fields are provided.';
				form.message = message;

				toastStore.trigger({
					message,
					background: 'variant-filled-error',
					classes: 'rounded-none font-semibold'
				});
				return { form };
			}

			if (specifyListOfServices && form.data.servicesListIds.length === 0) {
				form.valid = false;
				submitting = false;
				let message = 'List of Services cannot be empty';
				form.message = message;

				toastStore.trigger({
					message,
					background: 'variant-filled-error',
					classes: 'rounded-none font-semibold'
				});
				return { form };
			}

			try {
				const { id, title, incidentStart, description, ticketNumber } = await createTicket(
					form.data
				);

				drawerStore.close();

				toastStore.trigger({
					type: 'success',
					message: 'Incident Created Successfully!',
					background: 'variant-filled-success',
					classes: 'rounded-none font-semibold',
					timeout: 5000
				});

				for (const email of teamEmails) {
					await sendTicketCreationNotification({
						id,
						email,
						subject: title,
						startDate: parseDateAndTime(incidentStart),
						description,
						ticketNumber
					});
				}

				toastStore.trigger({
					type: 'success',
					message: 'Teams involved have been successfully notified of the new Incident!',
					background: 'variant-filled-success',
					classes: 'rounded-none font-semibold',
					timeout: 5000
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

				form.message = e.response.details;

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
		$form.departmentIds = departmentIds;
		$form.categoryId = catId;
		$form.categoryLevelId = catLevelId;
		$form.teamEquipmentIds = equipIds;
		$form.regionId = regionId;
		$form.areaId = areaId;
		$form.siteId = siteId;
	}

	$: specifyListOfServices = $form.serviceImpact === 'Yes' ? true : false;
	$: if ($form.serviceImpact === 'No') {
		$form.servicesListIds = [];
	}
</script>

{#if $delayed || submitting}
	<SpinnerOverlay />
{/if}

<div class="h-full flex flex-col justify-between gap-y-4 w-full">
	<div class="flex flex-col">
		<form method="POST" enctype="multipart/form-data" use:enhance>
			<div class="flex flex-col justify-between gap-4">
				{#if $message}
					<span class="my-2 text-error-500 input p-4 border-red-500 font-semibold">{$message}</span>
				{/if}

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
					<p class="my-2 text-base font-semibold">Select Technician</p>
					<div class="flex flex-row">
						<select
							class="select rounded-none w-full"
							name="technicianId"
							bind:value={$form.technicianId}
							{...$constraints.technicianId}
						>
							<option value={null} disabled selected>
								<span class="!text-gray-500">-- select --</span>
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

				{#if specifyListOfServices}
					<div class="flex flex-col gap-4">
						<p class="mt-2 text-base font-semibold">
							List of Services / Circuits
							<span class="text-red-500">*</span>
						</p>

						<form class="card w-full max-h-48 p-4 overflow-y-auto" tabindex="-1">
							<ListBox multiple>
								{#each servicesListOptions as { value, label }}
									<ListBoxItem bind:group={$form.servicesListIds} name="medium" {value}>
										{label}
									</ListBoxItem>
								{/each}
							</ListBox>
						</form>
					</div>
				{/if}

				<div class="flex flex-col">
					<label class="my-2 text-base font-semibold" for="attachment">
						Upload Attachment
						<span class="text-red-500">*</span>
					</label>

					{#if $errors.attachment}
						<span class=" text-error-500">{$errors.attachment}</span>
					{/if}

					<p class="mb-2 text-sm font-semibold text-primary-500 dark:text-tertiary-500">
						Max file upload 5 (MB)
					</p>

					<input
						class="w-full rounded text-base text-gray-900 border border-gray-300 dark:border-gray-700 cursor-pointer bg-gray-50 dark:bg-transparent dark:text-white focus:outline-none p-1"
						name="attachment"
						bind:files={$attachment}
						required
						type="file"
						{...$constraints.attachment}
					/>
				</div>
			</div>
		</form>
	</div>
</div>
