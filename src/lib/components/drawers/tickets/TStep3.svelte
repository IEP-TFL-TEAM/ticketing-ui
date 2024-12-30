<script>
	import Svelecte from 'svelecte';
	import { onMount } from 'svelte';
	import { superForm, defaults, fileProxy, dateProxy } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { getToastStore, getDrawerStore } from '@skeletonlabs/skeleton';
	import { ticketSchema } from '$lib/schemas/ticketSchema';
	import { createTicket, sendTicketCreationNotification } from '$lib/api/tickets';
	import { parseDateAndTime } from '$lib/utils/parsers';

	import { getFaultList } from '$lib/api/faultTypes';
	import { getTechnicians } from '$lib/api/technicians';
	import { getServicesList } from '$lib/api/servicesList';
	import {
		getVerifiedBroadcastRecipients,
		getVerifiedAutoEmailRecipients
	} from '$lib/api/recipients';

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
	const verifiedCCEmailRecipient = $drawerStore.meta.verifiedCCEmailRecipient;

	let faultTypeList = [];
	let technicians = [];
	let servicesList = [];
	let verifiedRecipients = [];
	let verifiedAutoEmailRecipients = [];

	onMount(async () => {
		const results = await Promise.allSettled([
			getFaultList(),
			getTechnicians(),
			getServicesList(),
			getVerifiedBroadcastRecipients(),
			getVerifiedAutoEmailRecipients()
		]);

		[faultTypeList, technicians, servicesList, verifiedRecipients, verifiedAutoEmailRecipients] =
			results.map(({ status, value }) => (status === 'fulfilled' ? value : []));

		// Sort alphabetically by name
		faultTypeList = faultTypeList.sort((a, b) => a.name.localeCompare(b.name));
		technicians = technicians.sort((a, b) => a.name.localeCompare(b.name));
		servicesList = servicesList.sort((a, b) => a.name.localeCompare(b.name));
	});

	let submitting = false,
		technicianEmail;

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
				const { id, title, incidentStart, description, ticketNumber, expand } = await createTicket(
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

				if (technicianEmail) teamEmails.unshift(technicianEmail);
				if (verifiedAutoEmailRecipients.length > 0) {
					for (const email of autoEmails) {
						teamEmails.push(email);
					}
				}

				for (const email of teamEmails) {
					await sendTicketCreationNotification({
						id,
						email,
						cc: verifiedCCEmailRecipient.length > 0 ? verifiedCCEmailRecipient[0].email : '',
						subject: title,
						incidentStart: parseDateAndTime(incidentStart),
						description,
						ticketNumber,
						category: expand?.categoryId?.name,
						severity: expand?.categoryLevelId?.name,
						technician: expand?.technicianId?.name ?? 'N/A'
					});

					if (technicianEmail && email === technicianEmail) {
						toastStore.trigger({
							type: 'success',
							message: 'Technician assigned has been successfully notified of the new Incident!',
							background: 'variant-filled-success',
							classes: 'rounded-none font-semibold',
							timeout: 5000
						});
					}
				}

				toastStore.trigger({
					type: 'success',
					message:
						'EMT, Front Liners, and Teams involved have been successfully notified of the new Incident!',
					background: 'variant-filled-success',
					classes: 'rounded-none font-semibold',
					timeout: 5000
				});
			} catch (e) {
				form.valid = false;
				submitting = false;

				toastStore.trigger({
					message: e.response?.details ?? 'An error occurred while creating the incident.',
					background: 'variant-filled-error',
					classes: 'rounded-none font-semibold',
					timeout: 3000
				});

				form.message = e.response?.details ?? 'An unexpected error occurred.';

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

	let autoEmails = [],
		servicesListOptions = [],
		sortedFaultTypes = [];

	$: {
		autoEmails = verifiedAutoEmailRecipients.map((item) => item.email);
		servicesListOptions = servicesList.map((item) => ({
			label: item.name,
			value: item.id
		}));

		sortedFaultTypes = faultTypeList.map(({ id, name }) => ({
			id,
			name
		}));
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
							class="input p-4 border dark:bg-gradient-to-r dark:from-black/10 dark:to-neutral-300/80"
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
						<select class="hidden" disabled></select>

						<Svelecte
							options={technicians}
							bind:value={$form.technicianId}
							on:change={() => {
								const selectedTech = technicians.find((t) => t.id === $form.technicianId);
								technicianEmail = selectedTech ? selectedTech.email : null;
							}}
							class="!text-primary-500 dark:!text-tertiary-500"
							{...$constraints.technicianId}
						/>

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
						<select class="hidden" disabled></select>

						<Svelecte
							options={sortedFaultTypes}
							bind:value={$form.faultTypeId}
							class="!text-primary-500 dark:!text-tertiary-500"
							required
							{...$constraints.faultTypeId}
						/>

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
						<select class="hidden" disabled></select>

						<Svelecte
							options={['Yes', 'No']}
							bind:value={$form.serviceImpact}
							class="!text-primary-500 dark:!text-tertiary-500"
							required
							{...$constraints.serviceImpact}
						/>

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

						<Svelecte
							options={servicesListOptions}
							bind:value={$form.servicesListIds}
							class="!text-primary-500 dark:!text-tertiary-500"
							required={specifyListOfServices}
							{...$constraints.servicesListIds}
							multiple
						/>
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
