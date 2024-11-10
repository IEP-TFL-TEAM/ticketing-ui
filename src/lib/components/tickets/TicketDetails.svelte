<script>
	import { parseDateAndTime } from '$lib/utils/parsers';
	import { getStatusColor } from '$lib/actions/getStatusColor';

	export let ticket;

	const tdStyles = 'text-primary-600 dark:text-tertiary-500';
</script>

<table class="table table-hover w-full !bg-neutral-200/20 dark:!bg-neutral-900/30">
	<tbody>
		{#if ticket.status !== 'CLOSED'}
			<tr>
				<td>Incident Start</td>
				<td class={tdStyles}>{parseDateAndTime(ticket.incidentStart)}</td>
			</tr>

			<tr>
				<td>Status</td>
				<td class={`${getStatusColor(ticket.status)} font-bold`}>{ticket.status}</td>
			</tr>
		{/if}

		<tr>
			<td>Category</td>
			<td class={tdStyles}>{ticket.expand?.categoryId?.name}</td>
		</tr>

		<tr>
			<td>Severity</td>
			<td class={tdStyles}>{ticket.expand?.categoryLevelId?.name}</td>
		</tr>

		<tr>
			<td>Region</td>
			<td class={tdStyles}>{ticket.expand?.regionId?.name}</td>
		</tr>

		<tr>
			<td>Area</td>
			<td class={tdStyles}>{ticket.expand?.areaId?.name}</td>
		</tr>

		<tr>
			<td>Site</td>
			<td class={tdStyles}>{ticket.expand?.siteId?.name}</td>
		</tr>

		{#if ticket.status === 'PENDING'}
			<tr>
				<td>Fault Type</td>
				<td class={tdStyles}>{ticket.expand?.faultTypeId?.name ?? 'N/A'}</td>
			</tr>

			<tr>
				<td>Cause</td>
				<td class={tdStyles}>{ticket.expand?.cause?.name ?? 'N/A'}</td>
			</tr>
		{/if}

		<tr>
			<td>Service Impact</td>
			<td class={tdStyles}>{ticket.serviceImpact}</td>
		</tr>

		<tr>
			<td>List of Services</td>
			<td>
				{#if ticket.expand?.servicesListIds}
					<ol class="list {tdStyles}">
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
			<td class={tdStyles}
				>{ticket.expand?.reportedBy?.firstName + ' ' + ticket.expand?.reportedBy?.lastName}</td
			>
		</tr>
	</tbody>
</table>
