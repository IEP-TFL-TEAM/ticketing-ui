<script>
	export let ticket;
</script>

<table class="table table-hover w-full">
	<tbody>
		<tr>
			<td>Status</td>
			<td>{ticket.status}</td>
		</tr>
		<tr>
			<td>Assigned To</td>
			<td>{ticket.expand?.teamId?.name ?? 'Unassigned'}</td>
		</tr>
		<tr>
			<td>Category</td>
			<td>{ticket.expand?.categoryId?.name}</td>
		</tr>
		<tr>
			<td>Category Level</td>
			<td>{ticket.expand?.categoryLevelId?.name}</td>
		</tr>
		<tr>
			<td>Region</td>
			<td>{ticket.expand?.regionId?.name}</td>
		</tr>
		<tr>
			<td>Area</td>
			<td>{ticket.expand?.areaId?.name}</td>
		</tr>
		<tr>
			<td>Site</td>
			<td>{ticket.expand?.siteId?.name}</td>
		</tr>
		<tr>
			<td>Fault Type</td>
			<td>{ticket.expand?.faultTypeId?.name}</td>
		</tr>
		<tr>
			<td>Team Equipment</td>
			<td>{ticket.expand?.teamEquipmentId?.name}</td>
		</tr>
		<tr>
			<td>Reported By</td>
			<td>{ticket.expand?.reportedBy?.firstName + ' ' + ticket.expand?.reportedBy?.lastName}</td>
		</tr>
		<tr>
			<td>Closed By</td>
			<td
				>{ticket.closedBy.length > 0
					? ticket.expand?.closedBy?.firstName + ' ' + ticket.expand?.closedBy?.lastName
					: 'Not yet closed'}</td
			>
		</tr>
	</tbody>
</table>
