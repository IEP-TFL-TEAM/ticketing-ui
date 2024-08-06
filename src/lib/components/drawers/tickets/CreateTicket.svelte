<script>
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { getToastStore, getDrawerStore } from '@skeletonlabs/skeleton';
	import { ticketSchema } from '$lib/schemas/ticketSchema';
	import { createTicket } from '$lib/api/tickets';
	import { severityLevels } from '$lib/utils';
	import SpinnerOverlay from '$lib/components/layout/SpinnerOverlay.svelte';

	const toastStore = getToastStore();
	const drawerStore = getDrawerStore();

	let submitting = false;

	const originalForm = defaults(zod(ticketSchema));

	const { form, constraints, enhance, message, errors, delayed } = superForm(originalForm, {
		SPA: true,
		taintedMessage: 'Are you sure you want to leave?',
		multipleSubmits: 'prevent',
		validators: zod(ticketSchema),
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
</script>

{#if $delayed}
	<SpinnerOverlay />
{/if}

<div class="h-full flex flex-col justify-between gap-y-4 w-full">
	<div class="flex flex-col">
		<div class="px-10 pr-4 py-5">
			<h5 class="h5">New <b>Tickets</b> Record</h5>
		</div>

		<div class="w-full px-10">
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
						<span>Enter Description</span>
						<div class="flex flex-row">
							<select
								class="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-sm rounded focus:ring-primary-500 p-4 w-full"
								name="severity"
								bind:value={$form.severity}
								required
								{...$constraints.severity}
							>
								<option value={''} disabled selected>
									<span class="!text-gray-500">Select Severity Level</span>
								</option>
								{#each severityLevels as level}
									<option value={level}>
										{level}
									</option>
								{/each}
							</select>

							{#if $errors.severity}
								<span class=" text-error-500">{$errors.severity}</span>
							{/if}
						</div>
					</label>
				</div>
			</form>
		</div>
	</div>

	<div class="flex justify-end items-center gap-4 px-10 pr-4 py-5">
		<button
			type="button"
			class="btn variant-outline-primary rounded-none px-14 py-2 font-bold"
			on:click={() => drawerStore.close()}
		>
			Cancel
		</button>

		<form method="POST" enctype="multipart/form-data" use:enhance>
			<button
				type="submit"
				class="btn variant-filled-primary rounded-none px-14 py-2 font-bold"
				disabled={submitting}
			>
				Create
			</button>
		</form>
	</div>
</div>
