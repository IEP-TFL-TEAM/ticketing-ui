<script>
	import { goto } from '$app/navigation';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { onMount, onDestroy } from 'svelte';
	import pb from '$lib/api/pocketbaseClient';
	import CommentCard from '$lib/components/comments/CommentCard.svelte';
	import CommentForm from '$lib/components/comments/CommentForm.svelte';
	import { parseComment } from '$lib/utils/parsers';

	export let comments, ticketId, commentAttachmentUrls, commentAttachments;

	const toastStore = getToastStore();
	let unSubscribe;
	let combinedComments = [];

	onMount(async () => {
		combinedComments = comments.map((comment, index) => ({
			comment,
			attachmentUrl: commentAttachmentUrls[index] ?? null,
			attachment: commentAttachments[index] ?? null
		}));

		unSubscribe = await pb.collection('comments').subscribe(
			'*',
			async function (e) {
				toastStore.trigger({
					message: `Comment has been ${e.action}d!`,
					action: {
						label: 'View',
						response: () => goto(`/tickets/${e.record.ticketId}`)
					},
					timeout: 3000
				});

				if (ticketId === e.record.ticketId) {
					if (e.action === 'create') {
						comments = [...comments, e.record];

						combinedComments = comments.map((comment, index) => ({
							comment,
							attachmentUrl: commentAttachmentUrls[index] ?? null,
							attachment: commentAttachments[index] ?? null
						}));
					}
				}
			},
			{ expand: 'userId' }
		);
	});

	onDestroy(() => {
		unSubscribe?.();
	});

	$: {
		combinedComments = comments.map((comment, index) => ({
			comment,
			attachmentUrl: commentAttachmentUrls[index] ?? null,
			attachment: commentAttachments[index] ?? null
		}));
	}
</script>

<div class="w-full">
	<div class="h-full {combinedComments.length === 0 ? '' : 'max-h-[42rem] overflow-y-auto'}">
		{#if combinedComments.length === 0}
			<span class="text-sm mt-2">Comments will appear here ...</span>
		{:else}
			{#each combinedComments as { comment, attachmentUrl, attachment }}
				<CommentCard {...parseComment(comment)} {attachmentUrl} {attachment} />
			{/each}
		{/if}
	</div>

	<div class={comments.length === 0 ? '' : 'mt-5'}>
		<CommentForm {ticketId} />
	</div>
</div>
