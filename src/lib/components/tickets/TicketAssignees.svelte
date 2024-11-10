<script>
	export let ticket;
</script>

<table class="table table-hover w-full !bg-neutral-200/20 dark:!bg-neutral-900/30">
	<tbody>
		<tr>
			<td>Selected Technician</td>
			<td class="text-primary-600 dark:text-tertiary-500"
				>{ticket.expand?.technicianId?.name ?? 'N/A'}</td
			>
		</tr>
	</tbody>
</table>
