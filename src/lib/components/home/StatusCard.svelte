<script>
	import { parseStatus, timeAgo } from '$lib/utils/parsers';
	export let requests;
	export let data;

	$: tickets = data.tickets;

	$: statusItems = [
		{
			label: 'Total',
			count: data.tickets.length,
			colorClass: 'text-primary-500'
		},
		{
			label: 'Approved',
			count: countByStatus(tickets, 'APPROVED'),
			colorClass: 'text-success-500'
		},
		{
			label: 'Pending',
			count: countByStatus(tickets, 'PENDING'),
			colorClass: 'text-secondary-500'
		},
		{
			label: 'Closed',
			count: countByStatus(tickets, 'CLOSED'),
			colorClass: 'text-red-500'
		}
	];

	function countByStatus(array, status) {
		return array.filter((record) => record.status === status).length;
	}
</script>

<div class="flex flex-col items-start gap-2 py-6">
	<h2
		class="self-center 2xl:self-start text-2xl font-bold mb-4 text-primary-500 dark:text-tertiary-500"
	>
		Incident Status
	</h2>
	<div class="grid w-full grid-cols-1 gap-4 text-center rounded-md shadow-md xl:grid-cols-4">
		{#each statusItems as { label, count, colorClass }}
			<div class="p-6 bg-white rounded-md dark:bg-neutral-700/30">
				<h3 class="mb-2 text-lg font-semibold uppercase">{label}</h3>
				<p class="text-3xl font-bold {colorClass}">
					{count}
				</p>
			</div>
		{/each}
	</div>
	<div class="mt-6 w-full h-full">
		<h2 class="2xl:self-start text-2xl font-bold mb-4 text-primary-500 dark:text-tertiary-500">
			Tickets Summary
		</h2>
		<table class="table table-hover bg-white rounded-md">
			<thead>
				<tr class="">
					<th class="mb-2 uppercase">Title</th>
					<th class="mb-2 uppercase">Assigned to</th>
					<th class="mb-2 uppercase">Region</th>
					<th class="mb-2 uppercase">Area</th>
					<th class="mb-2 uppercase">Created at</th>
					<th class="mb-2 uppercase">Status</th>
				</tr>
			</thead>
			<tbody>
				{#each tickets as ticket, index}
					{#if index < 2}
						<tr>
							<td>{ticket.title}</td>
							<td>{ticket.expand?.teamId?.name}</td>
							<td>{ticket.expand?.regionId?.name}</td>
							<td>{ticket.expand?.areaId?.name}</td>
							<td>{timeAgo(Date.parse(ticket.created))}</td>
							<td>{ticket.status}</td>
						</tr>
					{:else}
						<tr class="hidden">
							<td>{ticket.title}</td>
							<td>{ticket.expand?.teamId?.name}</td>
							<td>{ticket.expand?.regionId?.name}</td>
							<td>{ticket.expand?.areaId?.name}</td>
							<td>{timeAgo(Date.parse(ticket.created))}</td>
							<td>{ticket.status}</td>
						</tr>
					{/if}
				{/each}
				<tr>
					<td colspan="6" class="text-center">
						<button
							class="bg-white border border-gray-300 rounded-md py-2 px-4"
							on:click={() => {
								document
									.querySelectorAll('tr.hidden')
									.forEach((tr) => tr.classList.remove('hidden'));
								this.classList.add('hidden');
								document.querySelector('button.show-less').classList.remove('hidden');
							}}
						>
							Show more
						</button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
