<script>
	import { onDestroy, onMount } from 'svelte';
	import pb from '$lib/api/pocketbaseClient';
	import { goto } from '$app/navigation';
	import { Accordion, AccordionItem, getToastStore } from '@skeletonlabs/skeleton';
	import { parseStatus } from '$lib/utils/parsers';
	import { expand } from '$lib/api/tickets';

	import TicketActions from '$lib/components/tickets/TicketActions.svelte';
	import TicketComments from '$lib/components/tickets/TicketComments.svelte';
	import TicketAttachments from '$lib/components/tickets/TicketAttachments.svelte';
	import TicketDetails from '$lib/components/tickets/TicketDetails.svelte';
	import TicketHistory from '$lib/components/tickets/TicketHistory.svelte';
	import TicketMap from '$lib/components/tickets/TicketMap.svelte';

	export let data;
	$: ticket = data.ticket;
	$: teams = data.teams;
	$: comments = data.comments;
	$: attachmentUrl = data.attachmentUrl;
	$: attachment = data.attachment;
	$: solutionCodes = data.solutionCodes;
	$: site = data.site;
	$: officeLocations = data.officeLocations;

	const toastStore = getToastStore();
	let unSubscribe;

	onMount(async () => {
		unSubscribe = await pb.collection('tickets').subscribe(
			'*',
			async (e) => {
				toastStore.trigger({
					message: `A ticket has been ${e.action}d! ${e.record.expand.reportedBy.firstName} ${e.record.expand.reportedBy.lastName}`,
					action: {
						label: 'View',
						response: () => goto(`/tickets/${e.record.id}`)
					}
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

<div class="h-full w-full border-r-gray-300 mt-6">
	<div class="flex justify-between items-end p-5">
		<div>
			<span class="text-primary-500 dark:text-tertiary-500 text-xl font-extrabold"
				>Ticket #{ticket?.count}</span
			>
			<div class="w-full flex mt-2">
				<span class={`${parseStatus(ticket.status)} mr-3`}>
					{ticket.status}
				</span>

				<span class="badge variant-ghost-primary mr-3 px-2">
					{ticket.expand?.teamId?.name ?? 'UNASSIGNED'}
				</span>

				<span class=" font-extrabold">{ticket.title}</span>
			</div>
		</div>

		<TicketActions {teams} {ticket} {solutionCodes} />
	</div>

	<div class="flex min-h-screen px-5">
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
							<TicketComments {comments} ticketId={ticket.id} />
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

	<TicketMap
		lng={site.expand?.locationId?.longitude}
		lat={site.expand?.locationId?.latitude}
		site={site.name}
		{officeLocations}
	/>
</div>
