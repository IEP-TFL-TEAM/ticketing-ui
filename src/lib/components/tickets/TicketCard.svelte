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
			data-sveltekit-preload-data="tap"
			href={`/tickets/${ticket.id}`}
			class="block card card-hover p-4 bg-white mb-2 cursor-pointer"
		>
			<div class="flex justify-between items-start">
				<div class="flex flex-col gap-2">
					<h3 class="h3 font-bold text-primary-500 dark:text-tertiary-500">
						{ticket.ticketNumber}
					</h3>

					<h3 class="h3">
						{ticket.title}
					</h3>
				</div>

				<span class="text-sm font-semibold">
					{timeAgo(Date.parse(ticket.created))}
				</span>
			</div>

			<p class="my-1 mb-3">{ticket.description}</p>

			<div class="flex justify-between">
				<div class="flex gap-1">
					<span
						class={`badge variant-outline-primary dark:variant-outline-tertiary p text-sm text-primary-500 dark:text-tertiary-400`}
					>
						{ticket.expand?.categoryId?.name}
					</span>

					<span class={`${parseStatus(ticket.status)} p text-sm `}>
						{ticket.status}
					</span>

					<span class={`badge variant-outline-error p text-sm text-error-500 dark:text-error-400`}>
						{ticket.expand?.categoryLevelId?.name}
					</span>
				</div>

				<span
					class="border-l border-black dark:border-white p py-1 px-2 text-sm text-black dark:text-gray-200 font-semibold"
				>
					By: {ticket.expand?.reportedBy?.firstName}
					{ticket.expand?.reportedBy?.lastName}
				</span>
			</div>
		</a>
	{/each}
{/if}
