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
				await addComment(ticketId, form.data);
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
		<textarea
			class="textarea text-sm p-2 placeholder:text-black dark:placeholder:text-white"
			name="content"
			bind:value={$form.content}
			placeholder="Type Your Comment here ..."
			type="text"
			rows="2"
			required
			{...$constraints.content}
		/>

		<div class="flex flex-col mb-4">
			{#if $errors.attachment}
				<span class=" text-error-500">{$errors.attachment}</span>
			{/if}

			<input
				class="w-full rounded text-sm text-neutral-900 border border-neutral-500 dark:border-neutral-700 cursor-pointer bg-transparent dark:text-white focus:outline-none"
				name="attachment"
				bind:files={$attachment}
				type="file"
				{...$constraints.attachment}
			/>
		</div>

		<button type="submit" class="btn variant-filled-primary text-sm p-2 my-2"> Add Comment </button>
	</form>
</div>
