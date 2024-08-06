<script>
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { createComment } from '$lib/api/comments';
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
				form.message = 'Please verify that all rquired fields are provided.';

				toastStore.trigger({
					message: 'Please verify that all rquired fields are provided.',
					background: 'variant-filled-error',
					classes: 'rounded-none font-semibold'
				});
				return { form };
			}

			try {
				const content = form.data.content;
				await createComment({ ticketId, content });
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

<div class="w-full text-base">
	<form method="POST" enctype="multipart/form-data" use:enhance class="w-full rounded-lg">
		<textarea
			class="textarea text-xs p-2"
			name="content"
			bind:value={$form.content}
			placeholder="Type Your Comment"
			type="text"
			rows="2"
			required
			{...$constraints.content}
		/>

		{#if $errors.title}
			<span class=" text-error-500">{$errors.title}</span>
		{/if}

		<button type="submit" class="btn variant-filled-primary text-xs p-2 my-2"> Add Comment </button>
	</form>
</div>
