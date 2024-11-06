<script>
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { Doughnut } from 'svelte-chartjs';
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		ArcElement,
		CategoryScale,
		BarElement,
		LinearScale
	} from 'chart.js';
	import { countByStatus } from '$lib/actions/countByStatus';

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, BarElement, LinearScale);

	export let data;

	const pendingRoutines = countByStatus(data.routines, 'PENDING');
	const closedRoutines = countByStatus(data.routines, 'CLOSED');

	const pieData = {
		labels: ['Closed', 'Pending'],
		datasets: [
			{
				data: [closedRoutines, pendingRoutines],
				backgroundColor: ['#84cc16', '#e6b021'],
				hoverBackgroundColor: ['#a9db5c', '#ffc425']
			}
		]
	};

	const fullCompletionPercentage =
		data.routines.length > 0 ? (closedRoutines / data.routines.length) * 100 : 0;
</script>

<div class="flex flex-col items-start gap-2 py-6">
	<div class="grid w-1/2 grid-cols-1 gap-4 xl:grid-cols-2">
		<div
			class="card p-8 rounded bg-transparent dark:bg-white/95 shadow border border-black/5 dark:border-white/10 text-black"
		>
			<div class="h-full w-full">
				<h3 class="mb-2 text-lg font-semibold uppercase">Pending vs Closed</h3>

				<div class="flex items-center justify-between">
					<div>
						<Doughnut data={pieData} options={{ responsive: true }} />
					</div>
				</div>
			</div>
		</div>

		<div
			class="card p-8 rounded bg-transparent dark:bg-transparent shadow border border-black/5 dark:border-white/10"
		>
			<div class="h-full w-full">
				<h3 class="mb-2 text-lg font-semibold uppercase">Completion %</h3>

				<div class="flex items-center justify-center p-6">
					<ProgressRadial
						value={fullCompletionPercentage}
						meter="stroke-success-700 dark:stroke-success-500"
						stroke={80}
						track="stroke-surface-500/30 dark:stroke-surface-600"
						class="w-full h-full"
					>
						{fullCompletionPercentage.toFixed(2)}%
					</ProgressRadial>
				</div>
			</div>
		</div>
	</div>
</div>
