<script>
	export let ticket;

	function getStatusColor(status) {
		return status === 'PENDING'
			? 'text-secondary-700 dark:text-secondary-500'
			: status === 'APPROVED'
				? 'text-success-700 dark:text-success-500'
				: 'text-error-500';
	}
</script>

<table class="table table-hover w-full">
	<tbody>
		<tr>
			<td>Status</td>
			<td class={`${getStatusColor(ticket.status)} font-bold`}>{ticket.status}</td>
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
			<td>Cause</td>
			<td>{ticket.expand?.causedBy?.name}</td>
		</tr>
		<tr>
			<td>Team Equipment</td>
			<td>{ticket.expand?.teamEquipmentId?.name}</td>
		</tr>
		<tr>
			<td>Reported By</td>
			<td>{ticket.expand?.reportedBy?.firstName + ' ' + ticket.expand?.reportedBy?.lastName}</td>
		</tr>

		{#if ticket.status === 'CLOSED'}
			<tr>
				<td>Solution</td>
				<td>
					{ticket.expand?.solution.name}
				</td>
			</tr>

			<tr>
				<td>Closing Remarks</td>
				<td>
					{ticket.closingRemarks}
				</td>
			</tr>

			<tr>
				<td>Closed By</td>
				<td>
					{ticket.expand?.closedBy?.firstName + ' ' + ticket.expand?.closedBy?.lastName}
				</td>
			</tr>
		{/if}
	</tbody>
</table>
