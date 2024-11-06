<script>
	export let ticket;
</script>

<table class="table table-hover w-full !bg-neutral-200/20 dark:!bg-neutral-900/30">
	<tbody>
		<tr>
			<td>Selected Technician</td>
			<td>{ticket.expand?.technicianId?.name ?? 'N/A'}</td>
		</tr>
	</tbody>
</table>
