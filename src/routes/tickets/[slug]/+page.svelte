<script>
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { parseStatus } from '$lib/utils/parsers';

	import TicketActions from '$lib/components/tickets/TicketActions.svelte';
	import TicketComments from '$lib/components/tickets/TicketComments.svelte';
	import TicketAttachments from '$lib/components/tickets/TicketAttachments.svelte';
	import TicketDetails from '$lib/components/tickets/TicketDetails.svelte';
	import TicketHistory from '$lib/components/tickets/TicketHistory.svelte';

	export let data;
	$: ticket = data.ticket;
	$: teams = data.teams;
	$: comments = data.comments;
	$: attachmentUrl = data.attachmentUrl;
	$: attachment = data.attachment;

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

		<TicketActions {teams} {ticket} />
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
</div>
