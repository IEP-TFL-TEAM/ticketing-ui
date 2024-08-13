<script>
	import { format } from 'date-fns';
	import { history } from '$lib/stores/historyStore';
</script>

{#each $history as item}
	<div class="w-full border-l-2 border-gray-400 pl-5 mt-0">
		<div class="text-black text-xs pt-2 dark:text-gray-200">
			{format(new Date(item.created), 'KK:mm aa do MMMM y')}
		</div>

		<a
			data-sveltekit-preload-data="tap"
			href={`/tickets/${item.ticketId}`}
			class="anchor text-sm text-primary-700 dark:text-secondary-600"
		>
			{item.action}
		</a>
	</div>
{/each}
