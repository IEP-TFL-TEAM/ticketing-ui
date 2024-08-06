<script>
	export let ticket;
</script>

<table class="table table-hover w-full">
	<tbody>
		<tr>
			<td>Category</td>
			<td>{ticket.expand?.categoryId?.name}</td>
		</tr>
		<tr>
			<td>Status</td>
			<td>{ticket.status}</td>
		</tr>
		<tr>
			<td>Severity</td>
			<td>{ticket.severity}</td>
		</tr>
		<tr>
			<td>Location</td>
			<td>{ticket.location}</td>
		</tr>
		<tr>
			<td>Assigned To</td>
			<td>{ticket.expand?.teamId?.name ?? 'Unassigned'}</td>
		</tr>
		<tr>
			<td>Reported By</td>
			<td>{ticket.expand?.reportedBy?.firstName + ' ' + ticket.expand?.reportedBy?.lastName}</td>
		</tr>
	</tbody>
</table>
