<script>
	import { parseStatus, timeAgo } from '$lib/utils/parsers';

	export let tickets;
</script>

{#if tickets.items.length === 0}
	<h3 class="h3">
		<span class="font-black">No tickets created</span>
	</h3>
{:else}
	{#each tickets.items as ticket}
		<a
			href={`/tickets/${ticket?.id}`}
			class="block card card-hover p-4 bg-white mb-2 cursor-pointer"
		>
			<div class="flex justify-between items-start">
				<div class="flex-col">
					<h3 class="h3">
						<span class="font-black">{ticket.count}</span>
						{ticket.title}
					</h3>
				</div>
				<span class="text-sm font-semibold">
					{timeAgo(Date.parse(ticket.created))}
				</span>
			</div>

			<p class="my-3">{ticket.description}</p>

			<span class={`${parseStatus(ticket.status)} p text-sm `}>
				{ticket.status}
			</span>

			<span class={`badge variant-filled-tertiary p text-sm `}>
				{ticket.expand?.teamId?.name ?? 'UNASSIGNED'}
			</span>

			<span class="badge variant-filled-surface p text-sm text-white dark:text-gray-200">
				#{ticket?.count}
			</span>
		</a>
	{/each}
{/if}
