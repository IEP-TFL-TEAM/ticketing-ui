<script>
	import { onDestroy, onMount } from 'svelte';
	import pb from '$lib/api/pocketbaseClient';
	import { goto } from '$app/navigation';
	import { Accordion, AccordionItem, getToastStore } from '@skeletonlabs/skeleton';
	import { parseStatus, parseDateAndTime } from '$lib/utils/parsers';
	import { expand } from '$lib/api/tickets';
	import { IconArrowNarrowLeft } from '@tabler/icons-svelte';
	import { calculateSLAStatus } from '$lib/utils/calculateSLAStatus';

	import TicketActions from '$lib/components/tickets/TicketActions.svelte';
	import TicketComments from '$lib/components/tickets/TicketComments.svelte';
	import TicketAttachments from '$lib/components/tickets/TicketAttachments.svelte';
	import TicketDetails from '$lib/components/tickets/TicketDetails.svelte';
	import TicketHistory from '$lib/components/tickets/TicketHistory.svelte';
	import TicketMap from '$lib/components/tickets/TicketMap.svelte';

	export let data;
	$: ({
		teams,
		ticket,
		comments,
		commentAttachmentUrls,
		commentAttachments,
		attachmentUrl,
		attachment,
		solutionCodes,
		causeCodes,
		categories,
		categoryLevels,
		site,
		officeLocations
	} = data);

	$: slaStatus = calculateSLAStatus(
		parseDateAndTime(ticket.incidentStart),
		parseDateAndTime(ticket.incidentEnd.length === 0 ? new Date() : ticket.incidentEnd)
	);

	const toastStore = getToastStore();
	let unSubscribe;

	onMount(async () => {
		unSubscribe = await pb.collection('tickets').subscribe(
			'*',
			async (e) => {
				toastStore.clear();
				toastStore.trigger({
					message: `A ticket has been ${e.action}d! by ${e.record.expand.reportedBy.firstName} ${e.record.expand.reportedBy.lastName}`,
					action: {
						label: 'View',
						response: () => goto(`/tickets/${e.record.id}`)
					},
					timeout: 3000
				});

				ticket = e.record;
			},
			{
				expand
			}
		);
	});

	onDestroy(() => {
		unSubscribe?.();
	});

	const accordionStyles =
		'border accordion card p-2 text-token border-black/10 dark:border-white/30';
</script>

<div class="flex">
	<a href="/tickets" class="mt-5">
		<IconArrowNarrowLeft size={40} />
	</a>
</div>

<div class="h-full w-full border-r-gray-300 mt-2">
	<div class="flex justify-between items-end p-5">
		<div class="flex flex-col gap-2">
			<h3 class="text-primary-500 dark:text-tertiary-500 text-xl font-extrabold">
				Ticket #: {ticket.ticketNumber}
			</h3>

			<div class="w-full flex items-center">
				<span class={`${parseStatus(ticket.status)} mr-3`}>
					{ticket.status}
				</span>

				<span class=" font-extrabold">{ticket.title}</span>
			</div>

			<p>
				Status: <span
					class="font-semibold {slaStatus.diffInHours <= 2 ? 'text-success-500' : 'text-error-500'}"
				>
					{slaStatus.status}
				</span>
			</p>
		</div>

		<TicketActions
			{teams}
			{ticket}
			{attachment}
			{solutionCodes}
			{causeCodes}
			{categories}
			{categoryLevels}
		/>
	</div>

	<div class="flex min-h-screen px-5 mb-5">
		<div class="h-full w-2/3">
			<div class="flex flex-col justify-start items-start px-1">
				<Accordion class="w-full">
					<AccordionItem open class={accordionStyles}>
						<svelte:fragment slot="summary">
							<h5 class="font-medium">Description</h5>
						</svelte:fragment>
						<svelte:fragment slot="content">
							<p class="pt-2 text-sm">
								{ticket.description ? ticket.description : 'No description'}
							</p>
						</svelte:fragment>
					</AccordionItem>

					<AccordionItem class={accordionStyles}>
						<svelte:fragment slot="summary">
							<h5 class="font-medium">Comments</h5>
						</svelte:fragment>
						<svelte:fragment slot="content">
							<TicketComments
								{comments}
								{commentAttachmentUrls}
								{commentAttachments}
								ticketId={ticket.id}
							/>
						</svelte:fragment>
					</AccordionItem>

					<AccordionItem open class={accordionStyles}>
						<svelte:fragment slot="summary">
							<h5 class="font-medium">Attachment</h5>
						</svelte:fragment>
						<svelte:fragment slot="content">
							<TicketAttachments {attachmentUrl} {attachment} />
						</svelte:fragment>
					</AccordionItem>

					<TicketMap
						lng={site.expand?.locationId?.longitude}
						lat={site.expand?.locationId?.latitude}
						site={site.name}
						{officeLocations}
					/>
				</Accordion>
			</div>
		</div>

		<div class="h-full w-1/3">
			<div class="flex flex-col justify-start items-start">
				<div class="w-full">
					<Accordion class="w-full">
						<AccordionItem open class={accordionStyles}>
							<svelte:fragment slot="summary">
								<h5 class="font-medium">Details</h5>
							</svelte:fragment>
							<svelte:fragment slot="content">
								<div class="table-container">
									<TicketDetails {ticket} />
								</div>
							</svelte:fragment>
						</AccordionItem>

						<AccordionItem open class={accordionStyles}>
							<svelte:fragment slot="summary">
								<h5 class="font-medium">History</h5>
							</svelte:fragment>
							<svelte:fragment slot="content">
								<TicketHistory />
							</svelte:fragment>
						</AccordionItem>
					</Accordion>
				</div>
			</div>
		</div>
	</div>
</div>
