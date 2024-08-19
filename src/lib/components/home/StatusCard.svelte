<script>
	export let data;

	$: tickets = data.tickets;

	$: approvedTickets = countByStatus(tickets, 'APPROVED');
	$: pendingTickets = countByStatus(tickets, 'PENDING');
	$: closedTickets = countByStatus(tickets, 'CLOSED');

	$: totalTickets = data.tickets.length;

	function countByStatus(array, status) {
		return array.filter((record) => record.status === status).length;
	}

	const cardStyle =
		'flex flex-col w-full h-full p-4 border rounded-md border-gray-400/30 dark:border-white/30';

	const cardSpanStyle = 'text-2xl text-primary-600 dark:text-tertiary-500';
</script>

<div class="flex flex-col items-start gap-2 mt-4">
	<h3 class="mb-4 font-semibold tracking-wide h3">Incident Status</h3>

	<div class="flex flex-col justify-between w-full gap-4 lg:flex-row">
		<div class={cardStyle}>
			<p class="font-semibold uppercase">Total</p>
			<p class={cardSpanStyle}>{totalTickets}</p>
		</div>

		<div class={cardStyle}>
			<p class="font-semibold uppercase">Approved</p>
			<p class={cardSpanStyle}>{approvedTickets}</p>
		</div>

		<div class={cardStyle}>
			<p class="font-semibold uppercase">Pending</p>
			<p class={cardSpanStyle}>{pendingTickets}</p>
		</div>

		<div class={cardStyle}>
			<p class="font-semibold uppercase">Closed</p>
			<p class={cardSpanStyle}>{closedTickets}</p>
		</div>
	</div>
</div>
