<script>
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { getToastStore, getDrawerStore } from '@skeletonlabs/skeleton';
	import { ticketSchema } from '$lib/schemas/ticketSchema';
	import { createTicket } from '$lib/api/tickets';
	import SpinnerOverlay from '$lib/components/layout/SpinnerOverlay.svelte';

	export let isValid,
		selectedTeamId,
		selectedCategoryId,
		selectedCategoryLevelId,
		selectedEquipmentId,
		selectedRegionId,
		selectedAreaId,
		selectedSiteId;

	const toastStore = getToastStore();
	const drawerStore = getDrawerStore();

	const faultTypeList = $drawerStore.meta.faultTypeList;

	let submitting = false;

	const originalForm = defaults(zod(ticketSchema(faultTypeList)));

	const { form, constraints, enhance, message, errors, delayed, submit } = superForm(originalForm, {
		SPA: true,
		taintedMessage: 'Are you sure you want to leave?',
		multipleSubmits: 'prevent',
		validators: zod(ticketSchema(faultTypeList)),
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
				await createTicket(form.data);
				drawerStore.close();

				toastStore.trigger({
					type: 'success',
					message: 'Form submitted successfully!',
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

	export const completeStepper = () => submit();

	$: {
		$form.teamId = selectedTeamId;
		$form.categoryId = selectedCategoryId;
		$form.categoryLevelId = selectedCategoryLevelId;
		$form.teamEquipmentId = selectedEquipmentId;
		$form.regionId = selectedRegionId;
		$form.areaId = selectedAreaId;
		$form.siteId = selectedSiteId;
	}

	$: if (
		$form.teamId &&
		$form.teamId !== '' &&
		$form.categoryId &&
		$form.categoryId !== '' &&
		$form.categoryLevelId &&
		$form.categoryLevelId !== '' &&
		$form.teamEquipmentId &&
		$form.teamEquipmentId !== '' &&
		$form.regionId &&
		$form.regionId !== '' &&
		$form.areaId &&
		$form.areaId !== '' &&
		$form.siteId &&
		$form.siteId !== ''
	)
		isValid = true;
</script>

{#if $delayed}
	<SpinnerOverlay />
{/if}

<div class="h-full flex flex-col justify-between gap-y-4 w-full">
	<div class="flex flex-col">
		<form method="POST" enctype="multipart/form-data" use:enhance>
			<div class="flex flex-col justify-between gap-4">
				<label class="label">
					<span>Enter Title</span>
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
					<span>Enter Description</span>
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
					<span>Select Fault Type</span>
					<div class="flex flex-row">
						<select
							size="10"
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
			</div>
		</form>
	</div>
</div>
