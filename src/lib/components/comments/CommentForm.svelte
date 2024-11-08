<script>
	import { superForm, defaults, fileProxy } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { addComment } from '$lib/api/comments';
	import { commentSchema } from '$lib/schemas/commentSchema';
	import SpinnerOverlay from '$lib/components/layout/SpinnerOverlay.svelte';

	export let ticketId;

	const toastStore = getToastStore();

	let submitting = false;

	const originalForm = defaults(zod(commentSchema));

	const { form, constraints, enhance, message, errors, delayed } = superForm(originalForm, {
		SPA: true,
		multipleSubmits: 'prevent',
		validators: zod(commentSchema),
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
				await addComment(ticketId, form.data);

				toastStore.trigger({
					message: 'Comment successfully added to this incident',
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
</script>

{#if $delayed}
	<SpinnerOverlay />
{/if}

<div class="w-full">
	<form method="POST" enctype="multipart/form-data" use:enhance class="w-full rounded-lg">
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-lg">
			<div class="bg-white dark:bg-black/40" />

			<textarea
				class="bg-white dark:bg-black/40 border-0 ring-0"
				name="prompt"
				required
				placeholder="Write a comment..."
				bind:value={$form.content}
				rows="1"
			/>

			<button type="submit" class="variant-filled-primary">Send</button>
		</div>

		<div class="flex flex-col my-4">
			{#if $errors.attachment}
				<span class=" text-error-500">{$errors.attachment}</span>
			{/if}

			<input
				class="w-full rounded-lg text-sm text-neutral-900 border border-neutral-500 dark:border-neutral-700 cursor-pointer bg-transparent dark:text-white focus:outline-none"
				name="attachment"
				bind:files={$attachment}
				type="file"
				{...$constraints.attachment}
			/>
		</div>
	</form>
</div>
