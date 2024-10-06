<script>
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { getToastStore, getDrawerStore } from '@skeletonlabs/skeleton';
	import { createTeam } from '$lib/api/teams';
	import { teamSchema } from '$lib/schemas/teamSchema';
	import SpinnerOverlay from '$lib/components/layout/SpinnerOverlay.svelte';

	const toastStore = getToastStore();
	const drawerStore = getDrawerStore();

	let submitting = false;

	const originalForm = defaults(zod(teamSchema()));

	const { form, constraints, enhance, errors, delayed } = superForm(originalForm, {
		SPA: true,
		taintedMessage: 'Are you sure you want to leave?',
		multipleSubmits: 'prevent',
		validators: zod(teamSchema()),
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
				await createTeam(form.data);
				drawerStore.close();

				toastStore.trigger({
					type: 'success',
					message: 'Team Created Successfully!',
					background: 'variant-filled-success',
					classes: 'rounded-none font-semibold',
					timeout: 3000
				});
			} catch (e) {
				form.valid = false;
				submitting = false;

				toastStore.trigger({
					message: 'Oops ... Something went wrong!',
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
</script>

{#if $delayed}
	<SpinnerOverlay />
{/if}

<div class="h-full flex flex-col justify-between gap-y-4 w-full p-5">
	<div class="flex flex-col gap-4">
		<div class="flex flex-col gap-3">
			<h3 class="h3 font-bold">Enter Team Details</h3>

			<hr />
		</div>

		<form method="POST" enctype="multipart/form-data" use:enhance>
			<div class="flex flex-col justify-between gap-4">
				<label class="label">
					<p class="my-2 text-base font-semibold">
						Enter Name
						<span class="text-red-500">*</span>
					</p>
					<div class="flex flex-row">
						<input
							class="input p-4 border"
							type="text"
							name="name"
							bind:value={$form.name}
							required
							placeholder="Please enter a team's name"
							{...$constraints.name}
						/>
					</div>

					{#if $errors.name}
						<span class=" text-error-500">{$errors.name}</span>
					{/if}
				</label>

				<div class="flex justify-between items-center mt-4">
					<button type="button" class="btn variant-outline" on:click={() => drawerStore.close()}>
						Close
					</button>

					<button type="submit" class="btn variant-filled-primary">Submit</button>
				</div>
			</div>
		</form>
	</div>
</div>
