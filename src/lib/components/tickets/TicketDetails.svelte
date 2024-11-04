<script>
	import { parseDateAndTime } from '$lib/utils/parsers';
	import { getStatusColor } from '$lib/actions/getStatusColor';

	export let ticket;
</script>

<table class="table table-hover w-full">
	<tbody>
		{#if ticket.status !== 'CLOSED'}
			<tr>
				<td>Incident Start</td>
				<td>{parseDateAndTime(ticket.incidentStart)}</td>
			</tr>

			<tr>
				<td>Status</td>
				<td class={`${getStatusColor(ticket.status)} font-bold`}>{ticket.status}</td>
			</tr>
		{/if}

		<tr>
			<td>Category</td>
			<td>{ticket.expand?.categoryId?.name}</td>
		</tr>

		<tr>
			<td>Severity</td>
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
			<td>{ticket.expand?.faultTypeId?.name ?? 'N/A'}</td>
		</tr>

		<tr>
			<td>Service Impact</td>
			<td>{ticket.serviceImpact}</td>
		</tr>

		<tr>
			<td>List of Services</td>
			<td>
				{#if ticket.expand?.servicesListIds}
					<ol class="list text-primary-600 dark:text-tertiary-500">
						{#each ticket.expand?.servicesListIds as { name }, idx}
							<li>
								<span>{idx + 1}.</span>
								<span class="flex-auto">{name}</span>
							</li>
						{/each}
					</ol>
				{:else}
					<span>-- none selected --</span>
				{/if}
			</td>
		</tr>

		<tr>
			<td>Reported By</td>
			<td>{ticket.expand?.reportedBy?.firstName + ' ' + ticket.expand?.reportedBy?.lastName}</td>
		</tr>
	</tbody>
</table>
