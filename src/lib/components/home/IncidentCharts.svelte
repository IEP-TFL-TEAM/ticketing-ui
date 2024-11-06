<script>
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { Bar, Doughnut } from 'svelte-chartjs';
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

	function countByCategoryId(array, categoryId) {
		return array.filter((record) => record.categoryId === categoryId && record.status === 'PENDING')
			.length;
	}

	const pendingTickets = countByStatus(data.tickets, 'PENDING');
	const closedTickets = countByStatus(data.tickets, 'CLOSED');

	const categoryCounts = data.categories.map(({ id, name }) => ({
		name,
		count: countByCategoryId(data.tickets, id)
	}));

	const colorMap = {
		// Default red color scheme
		default: {
			background: 'rgba(255, 87, 51, 0.4)',
			border: 'rgba(255, 87, 51, 1)'
		},
		// Alternative color scheme for names containing "non" #3bcbfb
		nonCategory: {
			background: 'rgba(59, 203, 251, 0.4)',
			border: 'rgba(59, 203, 251, 1)'
		}
	};

	const pieData = {
		labels: ['Closed', 'Pending'],
		datasets: [
			{
				data: [closedTickets, pendingTickets],
				backgroundColor: ['#84cc16', '#e6b021'],
				hoverBackgroundColor: ['#a9db5c', '#ffc425']
			}
		]
	};

	let categoryNames = [];
	const barData = {
		labels: ['Incidents'],
		datasets: [
			...categoryCounts.map((c) => {
				categoryNames.push(c.name);
				const isNonCategory = c.name.toLowerCase().includes('non');
				const colors = isNonCategory ? colorMap.nonCategory : colorMap.default;

				return {
					label: c.name,
					data: [c.count],
					backgroundColor: colors.background,
					borderColor: colors.border,
					borderWidth: 2
				};
			})
		]
	};

	const fullCompletionPercentage =
		data.tickets.length > 0 ? (closedTickets / data.tickets.length) * 100 : 0;
</script>

<div class="flex flex-col items-start gap-2 py-6">
	<div class="grid w-full grid-cols-1 gap-4 xl:grid-cols-2">
		<div
			class="card p-8 rounded bg-transparent dark:bg-white/95 shadow border border-black/5 dark:border-white/10 text-black"
		>
			<div class="flex flex-col justify-between items-start w-full">
				<h3 class="mb-2 text-lg font-semibold uppercase">
					{categoryNames[0]} vs {categoryNames[1]} - Pending
				</h3>

				<Bar data={barData} options={{ responsive: true }} />
			</div>
		</div>

		<div class="grid w-full grid-cols-1 gap-4 xl:grid-cols-2">
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
</div>
