<script>
	export let tickets;

	$: statusItems = [
		{
			label: 'Total',
			count: tickets.length,
			colorClass: 'text-primary-500 dark:text-tertiary-500'
		},
		{
			label: 'Pending',
			count: countByStatus(tickets, 'PENDING'),
			colorClass: 'text-secondary-500'
		},
		{
			label: 'Closed',
			count: countByStatus(tickets, 'CLOSED'),
			colorClass: 'text-success-500'
		}
	];

	function countByStatus(array, status) {
		return array.filter((record) => record.status === status).length;
	}
</script>

<div class="flex flex-col items-start gap-2 py-6">
	<h2 class="self-start text-2xl font-bold mb-4 text-primary-500 dark:text-tertiary-500">
		Incident Status
	</h2>

	<div class="grid w-full grid-cols-1 gap-4 text-center rounded-md shadow-md xl:grid-cols-3">
		{#each statusItems as { label, count, colorClass }}
			<div class="p-6 bg-white rounded-md dark:bg-neutral-700/30">
				<h3 class="mb-2 text-lg font-semibold uppercase">{label}</h3>
				<p class="text-3xl font-bold {colorClass}">
					{count}
				</p>
			</div>
		{/each}
	</div>
</div>
