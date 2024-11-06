<script>
	import { onDestroy, onMount } from 'svelte';
	import pb from '$lib/api/pocketbaseClient';
	import { goto } from '$app/navigation';
	import { Accordion, AccordionItem, getToastStore, getModalStore } from '@skeletonlabs/skeleton';
	import { parseStatus, parseDateAndTime } from '$lib/utils/parsers';
	import { expand } from '$lib/api/tickets';
	import { IconArrowNarrowLeft, IconMailFast } from '@tabler/icons-svelte';
	import { calculateSLAStatus } from '$lib/utils/calculateSLAStatus';

	import TicketActions from '$lib/components/tickets/TicketActions.svelte';
	import TicketComments from '$lib/components/tickets/TicketComments.svelte';
	import TicketAttachments from '$lib/components/tickets/TicketAttachments.svelte';
	import TicketDetails from '$lib/components/tickets/TicketDetails.svelte';
	import TicketClosureDetails from '$lib/components/tickets/TicketClosureDetails.svelte';
	import DepartmentAndTeamInfo from '$lib/components/tickets/DepartmentAndTeamInfo.svelte';
	import TicketHistory from '$lib/components/tickets/TicketHistory.svelte';
	import TicketMap from '$lib/components/tickets/TicketMap.svelte';
	import TicketAssignees from '$lib/components/tickets/TicketAssignees.svelte';

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
		officeLocations,
		verifiedRecipients
	} = data);

	$: slaStatus = calculateSLAStatus(
		parseDateAndTime(ticket.incidentStart),
		parseDateAndTime(ticket.incidentEnd.length === 0 ? new Date() : ticket.incidentEnd)
	);

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	function onClickSend() {
		modalStore.trigger({
			type: 'component',
			component: 'sendBroadcast',
			meta: { ticket, verifiedRecipients }
		});
	}

	let unSubscribe;

	onMount(async () => {
		unSubscribe = await pb.collection('tickets').subscribe(
			'*',
			async (e) => {
				toastStore.clear();
				toastStore.trigger({
					message: `An incident has been ${e.action}d! by ${e.record.expand.reportedBy.firstName} ${e.record.expand.reportedBy.lastName}`,
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
		'border accordion card p-2 text-token border-black/10 dark:border-white/30 !bg-neutral-200/20 dark:!bg-neutral-900/30';
</script>

<div class="flex">
	<a href="/tickets" class="mt-5">
		<IconArrowNarrowLeft size={40} />
	</a>
</div>

<div class="h-full w-full border-r-gray-300 mt-2">
	<div class="flex justify-between items-end p-5">
		<div class="flex flex-col gap-2">
			<div class="flex gap-2 items-center">
				<h3 class="text-primary-500 dark:text-tertiary-500 text-xl font-extrabold">
					Ticket #: {ticket.ticketNumber}
				</h3>

				<span class={`${parseStatus(ticket.status)} mr-3`}>
					{ticket.status}
				</span>
			</div>

			<h4 class="text-lg font-extrabold">
				Title: {ticket.title}
			</h4>

			<h5 class="text-base font-semibold">
				SLA Status:

				<span
					class={slaStatus.diffInHours <= 2
						? 'text-success-700 dark:text-success-500'
						: 'text-error-500'}
				>
					{slaStatus.status}
				</span>
			</h5>
		</div>

		<div class="flex flex-col gap-4">
			<button
				type="button"
				on:click={() => onClickSend()}
				class="font-medium text-white border rounded btn variant-filled dark:text-black"
			>
				<IconMailFast />
				<span class="hidden md:inline-block">Email Broadcast</span>
			</button>

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
						<AccordionItem open={ticket.status !== 'CLOSED'} class={accordionStyles}>
							<svelte:fragment slot="summary">
								<h5 class="font-medium">Incident Details</h5>
							</svelte:fragment>
							<svelte:fragment slot="content">
								<div class="table-container">
									<TicketDetails {ticket} />
								</div>
							</svelte:fragment>
						</AccordionItem>

						{#if ticket.status === 'CLOSED'}
							<AccordionItem open class={accordionStyles}>
								<svelte:fragment slot="summary">
									<h5 class="font-medium">Closure Information</h5>
								</svelte:fragment>
								<svelte:fragment slot="content">
									<div class="table-container">
										<TicketClosureDetails {ticket} />
									</div>
								</svelte:fragment>
							</AccordionItem>
						{/if}

						<AccordionItem open class={accordionStyles}>
							<svelte:fragment slot="summary">
								<h5 class="font-medium">Department / Team Information</h5>
							</svelte:fragment>
							<svelte:fragment slot="content">
								<div class="table-container">
									<DepartmentAndTeamInfo {ticket} />
								</div>
							</svelte:fragment>
						</AccordionItem>

						{#if ticket.expand?.technicianId}
							<AccordionItem open class={accordionStyles}>
								<svelte:fragment slot="summary">
									<h5 class="font-medium">Assignees</h5>
								</svelte:fragment>
								<svelte:fragment slot="content">
									<div class="table-container">
										<TicketAssignees {ticket} />
									</div>
								</svelte:fragment>
							</AccordionItem>
						{/if}

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
