<script>
	import { parseDateAndTime } from '$lib/utils/parsers';
	import { getStatusColor } from '$lib/actions/getStatusColor';

	export let ticket;

	function calculateOutageDuration(createdTime, updatedTime) {
		const createdDateTime = new Date(createdTime);
		const updatedDateTime = new Date(updatedTime);

		const diffInMs = updatedDateTime - createdDateTime;
		return diffInMs / (1000 * 60);
	}

	function calculateAvailability(outageMinutes, minutesInYear = 525600) {
		return (1 - outageMinutes / minutesInYear) * 100;
	}

	function getAvailability(ticket) {
		const outageDuration = calculateOutageDuration(ticket.incidentStart, ticket.incidentEnd);
		const totalTimeInYear = 525600;

		return calculateAvailability(outageDuration, totalTimeInYear);
	}
</script>

<table class="table table-hover w-full !bg-neutral-200/20 dark:!bg-neutral-900/30">
	<tbody>
		<tr>
			<td>Status</td>
			<td class={`${getStatusColor(ticket.status)} font-bold`}>{ticket.status}</td>
		</tr>

		<tr>
			<td>Incident Start</td>
			<td>{parseDateAndTime(ticket.incidentStart)}</td>
		</tr>

		<tr>
			<td>Incident End</td>
			<td>{parseDateAndTime(ticket.incidentEnd)}</td>
		</tr>

		<tr>
			<td>Fault Type</td>
			<td>{ticket.expand?.faultTypeId?.name ?? 'N/A'}</td>
		</tr>

		<tr>
			<td>Cause</td>
			<td>{ticket.expand?.cause?.name ?? 'N/A'}</td>
		</tr>

		<tr>
			<td>Solution</td>
			<td>{ticket.expand?.solution.name}</td>
		</tr>

		<tr>
			<td>Closing Remarks</td>
			<td>{ticket.closingRemarks}</td>
		</tr>

		<tr>
			<td>Closed By</td>
			<td>{ticket.expand?.closedBy?.firstName + ' ' + ticket.expand?.closedBy?.lastName}</td>
		</tr>

		<tr>
			<td>Availability</td>
			<td>{`${getAvailability(ticket).toFixed(6)}%`}</td>
		</tr>
	</tbody>
</table>
