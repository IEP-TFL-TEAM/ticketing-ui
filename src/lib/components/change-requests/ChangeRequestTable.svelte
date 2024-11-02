<script>
	import { IconArrowRight } from '@tabler/icons-svelte';
	import { getStatusColor } from '$lib/actions/getStatusColor';

	export let requests;

	const tableHeaderStyles = 'px-6 font-semibold py-2';
	const tdStyles = 'px-6 py-4';
</script>

<div class="relative mt-5 overflow-x-auto">
	{#if requests.items.length === 0}
		<div class="flex items-center justify-center w-full h-96">
			<p class="text-gray-500 dark:text-gray-400">No records found</p>
		</div>
	{:else}
		<table class="w-full text-sm text-left">
			<thead class="uppercase bg-gray-100 dark:bg-neutral-700">
				<tr>
					<th scope="col" class={tableHeaderStyles}> Ticket # </th>
					<th scope="col" class={tableHeaderStyles}> Title </th>
					<th scope="col" class={tableHeaderStyles}> Objective </th>
					<th scope="col" class={tableHeaderStyles}> Service Impact </th>
					<th scope="col" class={tableHeaderStyles}> Status </th>
					<th scope="col"></th>
				</tr>
			</thead>
			<tbody>
				{#each requests.items as request}
					<tr
						class="transition-colors bg-white border-b rounded dark:bg-neutral-800 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-900"
					>
						<td class={tdStyles}> {request.ticketNumber} </td>

						<td class={tdStyles}> {request.title} </td>

						<td class={tdStyles}> {request.objective} </td>

						<td
							class="{tdStyles} uppercase font-semibold {request.serviceImpact === 'Yes'
								? 'text-success-500'
								: 'text-error-500'}"
						>
							{request.serviceImpact}
						</td>

						<td class={`${getStatusColor(request.status)} font-bold ${tdStyles}`}>
							{request.status}
						</td>

						<td class={tdStyles}>
							<a
								href={`/change-requests/${request.id}`}
								class="font-medium text-primary-500 dark:text-tertiary-500 hover:underline cursor-pointer"
							>
								<IconArrowRight />
							</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
