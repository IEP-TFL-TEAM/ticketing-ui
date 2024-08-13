<script>
	import { parseStatus, timeAgo } from '$lib/utils/parsers';

	export let tickets;
</script>

{#if tickets.items.length === 0}
	<div class="flex items-center justify-center w-full h-96">
		<p class="text-black dark:text-white font-medium">Oops... No tickets found!</p>
	</div>
{:else}
	<div class="mt-4" />
	{#each tickets.items as ticket}
		<a
			href={`/tickets/${ticket.id}`}
			class="block card card-hover p-4 bg-white mb-2 cursor-pointer"
		>
			<div class="flex justify-between items-start">
				<div class="flex-col">
					<h3 class="h3">
						<span class="font-black">{ticket.count}</span>
						{ticket.title}
					</h3>

					<h4 class="text-sm text-primary-600 font-semibold dark:text-secondary-400 uppercase">
						{ticket.expand?.categoryId?.name}
					</h4>
				</div>

				<span class="text-sm font-semibold">
					{timeAgo(Date.parse(ticket.created))}
				</span>
			</div>

			<p class="my-1 mb-2">{ticket.description}</p>

			<div class="flex justify-between">
				<div class="flex gap-1">
					<span class={`${parseStatus(ticket.status)} p text-sm `}>
						{ticket.status}
					</span>

					<span class={`badge variant-filled-tertiary p text-sm `}>
						{ticket.expand?.teamId?.name ?? 'UNASSIGNED'}
					</span>

					<span class={`badge variant-outline-error p text-sm text-error-500 `}>
						{ticket.expand?.categoryLevelId?.name}
					</span>
				</div>

				<span class="badge variant-filled-surface p text-sm text-white dark:text-gray-200">
					# {ticket.count}
				</span>
			</div>
		</a>
	{/each}
{/if}
