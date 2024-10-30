<script>
	import { superForm, defaults, fileProxy, dateProxy } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { getToastStore, getDrawerStore, ListBoxItem, ListBox } from '@skeletonlabs/skeleton';
	import { routineMaintenanceSchema } from '$lib/schemas/routineMaintenanceSchema';
	import { createRoutineMaintenance } from '$lib/api/routineMaintenance';
	import SpinnerOverlay from '$lib/components/layout/SpinnerOverlay.svelte';

	export function onCompleteHandler() {
		submit();
	}

	export let staffId, teamIds, maintenanceTeamId, siteId, regionId, areaId;

	const toastStore = getToastStore();
	const drawerStore = getDrawerStore();

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
				await createRoutineMaintenance(form.data);
				drawerStore.close();

				toastStore.trigger({
					type: 'success',
					message: 'Routine Created Successfully!',
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

	$: {
		$form.requestee = staffId;
		$form.teamIds = teamIds;
		$form.maintenanceTeamId = maintenanceTeamId;
		$form.siteId = siteId;
		$form.regionId = regionId;
		$form.areaId = areaId;
	}

	$: startDateVal = dateProxy(form, 'startDate', { format: 'datetime-local', empty: 'null' });
	$: endDateVal = dateProxy(form, 'endDate', { format: 'datetime-local', empty: 'null' });
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
						<span class="mt-2 text-error-500">{$errors.title}</span>
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
						<span class="mt-2 text-error-500">{$errors.objective}</span>
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
						<span class="mt-2 text-error-500">{$errors.scopeOfWork}</span>
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
							class="input p-4 border"
							min={$startDateVal}
							{...$constraints.endDate}
						/>
					</div>

					{#if $errors.endDate}
						<span class="mt-2 text-error-500">{$errors.endDate}</span>
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
							<span class="mt-2 text-error-500">{$errors.serviceImpact}</span>
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
						<span class="mt-2 text-error-500">{$errors.duration}</span>
					{/if}
				</label>

				{#if specifyListOfServices}
					<div class="flex flex-col gap-4">
						<p class="mt-2 text-base font-semibold">
							List of Services / Circuits (At Risk Services/Circuits)
							<span class="text-red-500">*</span>
						</p>

						<p class="text-sm font-semibold text-primary-500 dark:text-tertiary-500">
							List all services surrounding the work. Non-service affecting or service affecting.
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
					<label class="my-2 text-base font-semibold" for="attachment"> Upload Attachment </label>

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
						type="file"
						{...$constraints.attachment}
					/>
				</div>
			</div>
		</form>
	</div>
</div>
