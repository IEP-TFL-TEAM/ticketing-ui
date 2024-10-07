export function calculateSLAStatus(startDateStr, endDateStr) {
	const startDate = new Date(startDateStr);
	const endDate = new Date(endDateStr);

	const diffInMilliseconds = endDate - startDate;
	const diffInHours = diffInMilliseconds / (1000 * 60 * 60); // 1 hour = 1000ms * 60s * 60min
	const status = diffInHours <= 2 ? 'Within SLA' : 'SLA Exceeded';

	return { diffInHours, status };
}
