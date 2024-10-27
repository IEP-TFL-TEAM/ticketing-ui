<script>
	import { superForm, defaults, fileProxy, dateProxy } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { getToastStore, getModalStore } from '@skeletonlabs/skeleton';
	import { ticketSchema } from '$lib/schemas/ticketSchema';
	import { updateTicketById } from '$lib/api/tickets.js';
	import SpinnerOverlay from '$lib/components/layout/SpinnerOverlay.svelte';

	const toastStore = getToastStore();
	const modalStore = getModalStore();
	const ticket = $modalStore[0].meta.ticket;
	const categories = $modalStore[0].meta.categories;
	const categoryLevels = $modalStore[0].meta.categoryLevels;
	const zodForm = zod(ticketSchema($modalStore[0].meta.attachment, ticket.incidentStart));
	const originalForm = defaults(zodForm);

	let submitting = false;
	let dirtyForm = false;
	let severityLevels = [];

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
					classes: 'rounded-none font-semibold',
					timeout: 3000
				});
				return { form };
			}

			try {
				await updateTicketById(ticket.id, form.data);
				modalStore.close();

				toastStore.trigger({
					type: 'success',
					message: 'Ticket Updated Successfully!',
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
		$form.title = ticket.title;
		$form.description = ticket.description;
		$form.teamIds = ticket.teamIds;
		$form.categoryId = ticket.categoryId;
		$form.categoryLevelId = ticket.categoryLevelId;
		$form.teamEquipmentIds = ticket.teamEquipmentIds;
		$form.regionId = ticket.regionId;
		$form.areaId = ticket.areaId;
		$form.siteId = ticket.siteId;
		$form.faultTypeId = ticket.faultTypeId;
		$form.cause = ticket.cause;
		$form.technicianId = ticket.technicianId;
	}

	$: {
		severityLevels = categoryLevels.filter((level) => level.categoryId === $form.categoryId);
	}
</script>

{#if $delayed || submitting}
	<SpinnerOverlay />
{/if}

<div
	class="max-h-[50rem] w-full max-w-3xl p-8 bg-white border rounded shadow border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 max-xl:m-20 my-10 overflow-y-auto"
>
	<div class="flex flex-col gap-2">
		<h3 class="text-center text-black h3 dark:text-white">
			Updating
			<br />
			<span class="font-bold text-primary-500 dark:text-secondary-500">{ticket.ticketNumber}</span>
		</h3>

		<div>
			<form method="POST" enctype="multipart/form-data" use:enhance>
				<div class="flex flex-col justify-between gap-4">
					<div class="grid grid-cols-2 auto-rows-auto gap-2">
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
									bind:value={ticket.title}
									on:change={() => (dirtyForm = true)}
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
									bind:value={ticket.description}
									on:change={() => (dirtyForm = true)}
									placeholder="Please enter ticket description"
									{...$constraints.description}
								/>
							</div>

							{#if $errors.description}
								<span class=" text-error-500">{$errors.description}</span>
							{/if}
						</label>
					</div>

					<label class="label">
						<p class="my-2 text-base font-semibold">
							Enter Incident Start Date
							<span class="text-red-500">*</span>
						</p>
						<div class="flex flex-row">
							<input
								type="datetime-local"
								name="incidentStart"
								bind:value={$incidentStartVal}
								on:change={() => (dirtyForm = true)}
								required
								class="input p-4 border"
								{...$constraints.incidentStart}
							/>
						</div>

						{#if $errors.incidentStart}
							<span class=" text-error-500">{$errors.incidentStart}</span>
						{/if}
					</label>

					<div class="grid grid-cols-2 auto-rows-auto gap-2">
						<div class="flex flex-col gap-1">
							{#if $errors.categoryId}
								<span class=" text-error-500">{$errors.categoryId}</span>
							{/if}

							<select
								class="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm rounded focus:ring-primary-500 p-4 w-full"
								name="categoryId"
								bind:value={ticket.categoryId}
								on:change={() => (dirtyForm = true)}
								required
								{...$constraints.categoryId}
							>
								<option value={''} disabled selected>select category</option>
								{#each categories as item}
									<option value={item.id}>
										{item.name}
									</option>
								{/each}
							</select>
						</div>

						<div class="flex flex-col gap-1">
							{#if $errors.categoryLevelId}
								<span class=" text-error-500">{$errors.categoryLevelId}</span>
							{/if}

							<select
								class="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm rounded focus:ring-primary-500 p-4 w-full"
								name="categoryLevelId"
								bind:value={ticket.categoryLevelId}
								on:change={() => (dirtyForm = true)}
								required
								{...$constraints.categoryLevelId}
							>
								<option value={''} disabled selected>select severity</option>
								{#each severityLevels as item}
									<option value={item.id}>
										{item.name}
									</option>
								{/each}
							</select>
						</div>
					</div>

					<div class="flex flex-col">
						<div class="flex flex-col mb-4">
							<label class="my-2 text-base font-semibold" for="attachment">
								Upload Attachment
								<span class="text-red-500">*</span>
							</label>

							<div>
								<span class="text-sm underline break-words">
									{ticket.attachment}
								</span> (current)
							</div>
						</div>

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
