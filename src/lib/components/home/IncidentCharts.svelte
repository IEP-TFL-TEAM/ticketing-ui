<script>
	import { ProgressRadial, ConicGradient } from '@skeletonlabs/skeleton';
	import { Doughnut, Bar } from 'svelte-chartjs';
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
		return array.filter((record) => record.categoryId === categoryId).length;
	}

	const pendingTickets = countByStatus(data.tickets, 'PENDING');
	const closedTickets = countByStatus(data.tickets, 'CLOSED');

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

	const categoryCounts = data.categories.map((category) => ({
		name: category.name,
		count: countByCategoryId(data.tickets, category.id)
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

	const barData = {
		labels: ['Incidents'],
		datasets: [
			// {
			// 	label: 'Total Incidents',
			// 	data: [data.tickets.length],
			// 	backgroundColor: ['rgba(3, 104, 177, 0.4)'],
			// 	borderColor: ['rgba(3, 104, 177, 1)'],
			// 	borderWidth: 2
			// },
			...categoryCounts.map((c) => {
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

	const conicStops = [
		{ label: 'One', color: 'rgba(3, 104, 177, 1)', start: 0, end: 10 },
		{ label: 'Two', color: 'rgba(255, 196, 37, 0.5)', start: 10, end: 35 },
		{ label: 'Three', color: 'rgba(59, 203, 251, 0.25)', start: 35, end: 100 }
	];
</script>

<div class="grid grid-cols-2 auto-rows-auto w-full gap-10">
	<div>
		<ProgressRadial
			value={fullCompletionPercentage}
			meter="stroke-success-500"
			stroke={50}
			track="stroke-primary-500/30 dark:stroke-primary-100"
		>
			{fullCompletionPercentage.toFixed(2)}%
		</ProgressRadial>
	</div>

	<div>
		<ConicGradient stops={conicStops} legend>Map</ConicGradient>
	</div>

	<div>
		<Bar data={barData} options={{ responsive: true }} />
	</div>

	<div>
		<Doughnut data={pieData} options={{ responsive: true }} />
	</div>
</div>
