<script>
	import { IconTicket } from '@tabler/icons-svelte';
	import { countByStatus } from '$lib/actions/countByStatus';

	export let records, title;

	$: statusItems = [
		{
			label: 'Total',
			count: records.length,
			colorClass: 'text-primary-500 dark:text-tertiary-500'
		},
		{
			label: 'Pending',
			count: countByStatus(records, 'PENDING'),
			colorClass: 'text-secondary-700 dark:text-secondary-500'
		},
		{
			label: 'Closed',
			count: countByStatus(records, 'CLOSED'),
			colorClass: 'text-success-700 dark:text-success-500'
		}
	];
</script>

<div class="flex flex-col items-start gap-2 py-6">
	<h2 class="self-start text-2xl font-bold mb-4">
		{title} Status
	</h2>

	<div class="grid w-full grid-cols-1 gap-4 xl:grid-cols-3">
		{#each statusItems as { label, count, colorClass }}
			<div
				class="card p-8 rounded bg-transparent dark:bg-transparent shadow border border-black/5 dark:border-white/10"
			>
				<div class="flex justify-between items-start">
					<h3 class="mb-2 text-lg font-semibold uppercase">{label}</h3>

					<span>
						<IconTicket />
					</span>
				</div>

				<p class="text-3xl font-bold {colorClass}">
					+{count}
				</p>
			</div>
		{/each}
	</div>
</div>
