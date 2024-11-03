<script>
	import { format } from 'date-fns';
	import { history } from '$lib/stores/historyStore';
</script>

{#each $history as item}
	<div class="w-full border-l-2 border-black/50 dark:border-white/90 pl-5 my-3">
		<div class="text-black text-xs pt-2 dark:text-gray-200">
			{format(new Date(item.created), 'KK:mm aa do MMMM y')}
		</div>

		<a
			data-sveltekit-preload-data="tap"
			href={`/tickets/${item.ticketId}`}
			class="anchor text-sm text-primary-500 dark:text-tertiary-500"
		>
			{item.action}
		</a>
	</div>
{/each}
