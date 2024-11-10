<script>
	import { parseDateAndTime } from '$lib/utils/parsers';
	import { getStatusColor } from '$lib/actions/getStatusColor';

	export let ticket;

	const tdStyles = 'text-primary-600 dark:text-tertiary-500';
</script>

<table class="table table-hover w-full !bg-neutral-200/20 dark:!bg-neutral-900/30">
	<tbody>
		<tr>
			<td>Status</td>
			<td class={`${getStatusColor(ticket.status)} font-bold`}>{ticket.status}</td>
		</tr>

		<tr>
			<td>Incident Start</td>
			<td class={tdStyles}>{parseDateAndTime(ticket.incidentStart)}</td>
		</tr>

		<tr>
			<td>Incident End</td>
			<td class={tdStyles}>{parseDateAndTime(ticket.incidentEnd)}</td>
		</tr>

		<tr>
			<td>Fault Type</td>
			<td class={tdStyles}>{ticket.expand?.faultTypeId?.name ?? 'N/A'}</td>
		</tr>

		<tr>
			<td>Cause</td>
			<td class={tdStyles}>{ticket.expand?.cause?.name ?? 'N/A'}</td>
		</tr>

		<tr>
			<td>Solution</td>
			<td class={tdStyles}>{ticket.expand?.solution.name}</td>
		</tr>

		<tr>
			<td>Closing Remarks</td>
			<td class={tdStyles}>{ticket.closingRemarks}</td>
		</tr>

		<tr>
			<td>Closed By</td>
			<td class={tdStyles}
				>{ticket.expand?.closedBy?.firstName + ' ' + ticket.expand?.closedBy?.lastName}</td
			>
		</tr>

		<tr>
			<td>Availability</td>
			<td class={tdStyles}>{`${ticket?.availability}%`}</td>
		</tr>
	</tbody>
</table>
