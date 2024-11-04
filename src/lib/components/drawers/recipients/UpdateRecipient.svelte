<script>
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { getToastStore, getDrawerStore } from '@skeletonlabs/skeleton';
	import { recipientSchema } from '$lib/schemas/recipientSchema';
	import { updateRecipient } from '$lib/api/recipients';
	import SpinnerOverlay from '$lib/components/layout/SpinnerOverlay.svelte';

	const toastStore = getToastStore();
	const drawerStore = getDrawerStore();
	const record = $drawerStore.meta.record;

	let submitting = false;
	const originalForm = defaults(zod(recipientSchema()));

	const { form, constraints, enhance, errors, delayed, message } = superForm(originalForm, {
		SPA: true,
		taintedMessage: 'Are you sure you want to leave?',
		multipleSubmits: 'prevent',
		validators: zod(recipientSchema()),
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
					classes: 'rounded-none font-semibold',
					timeout: 3000
				});
				return { form };
			}

			try {
				await updateRecipient(record.id, form.data);
				drawerStore.close();

				toastStore.trigger({
					type: 'success',
					message: 'Recipient Updated Successfully!',
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

				form.message = e.response.details;

				return { form };
			}

			submitting = false;
		}
	});

	$: {
		$form.name = record.name;
		$form.email = record.email;
		$form.categoryId = record.categoryId;
	}
</script>

{#if $delayed}
	<SpinnerOverlay />
{/if}

<div class="h-full flex flex-col justify-between gap-y-4 w-full p-5">
	<div class="flex flex-col gap-4">
		<div class="flex flex-col gap-3">
			<h3 class="h3 font-bold">Update Recipient Details</h3>

			<hr />
		</div>

		<form method="POST" enctype="multipart/form-data" use:enhance>
			<div class="flex flex-col justify-between gap-4">
				{#if $message}
					<span class="my-2 text-error-500 input p-4 border-red-500 font-semibold">{$message}</span>
				{/if}

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
							bind:value={record.name}
							required
							placeholder="Please enter name"
							{...$constraints.name}
						/>
					</div>

					{#if $errors.name}
						<span class=" text-error-500">{$errors.name}</span>
					{/if}
				</label>

				<label class="label">
					<p class="my-2 text-base font-semibold">
						Enter Email
						<span class="text-red-500">*</span>
					</p>
					<div class="flex flex-row">
						<input
							class="input p-4 border"
							type="text"
							name="email"
							bind:value={record.email}
							required
							placeholder="Please enter email"
							{...$constraints.email}
						/>
					</div>

					{#if $errors.email}
						<span class=" text-error-500">{$errors.email}</span>
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
