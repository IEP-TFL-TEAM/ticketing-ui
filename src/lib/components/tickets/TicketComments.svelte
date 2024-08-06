<script>
	import { goto } from '$app/navigation';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { onMount, onDestroy } from 'svelte';
	import pb from '$lib/api/pocketbaseClient';
	import CommentCard from '$lib/components/comments/CommentCard.svelte';
	import CommentForm from '$lib/components/comments/CommentForm.svelte';
	import { parseComment } from '$lib/utils/parsers';

	export let comments, ticketId;

	let toastStore = getToastStore();
	let unSubscribe;

	onMount(async () => {
		unSubscribe = await pb.collection('comments').subscribe(
			'*',
			async function (e) {
				toastStore.trigger({
					message: `Comment has been ${e.action}d!`,
					action: {
						label: 'View',
						response: () => goto(`/tickets/${e.record.ticketId}`)
					}
				});

				if (ticketId === e.record.ticketId) {
					if (e.action === 'create') {
						comments = [...comments, e.record];
					}
				}
			},
			{ expand: 'userId' }
		);
	});

	onDestroy(() => {
		unSubscribe?.();
	});
</script>

{#each comments as comment}
	<CommentCard {...parseComment(comment)} />
{/each}
<CommentForm {ticketId} />
