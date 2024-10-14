<script>
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { updateTicket } from '$lib/api/tickets';
	import { currentUser } from '$lib/stores/auth';

	export let ticket,
		teams,
		solutionCodes,
		causeCodes,
		attachment,
		categories,
		categoryLevels,
		teamEquipment;

	$: role = $currentUser?.role;

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	async function reOpenTicket() {
		modalStore.trigger({
			type: 'confirm',
			title: 'Re-open this ticket',
			body: 'Are you sure you wish to proceed? This action will revert the status of the ticket to pending',
			response: async (r) => {
				if (r) {
					const updatedTicket = await updateTicket({
						...ticket,
						status: 'PENDING',
						closedBy: '',
						solution: null,
						closingRemarks: '',
						incidentEnd: ''
					});
					ticket = updatedTicket;

					toastStore.trigger({
						message: 'Ticket Reopened successfully.',
						background: 'variant-filled-success',
						timeout: 3000
					});
				}
			}
		});
	}

	async function closeTicket() {
		modalStore.trigger({
			type: 'component',
			component: 'closeTicket',
			meta: { ticket, solutionCodes, causeCodes },
			response: (r) => {
				if (r) {
					ticket = r.updatedTicket;
				}
			}
		});
	}

	function assignTicket() {
		modalStore.trigger({
			type: 'component',
			title: 'Assign Ticket',
			component: 'assignTicket',
			body: 'Select team(s) and team equipment(s) to assign this ticket to:',
			meta: { teams, teamEquipment },
			response: async (res) => {
				if (res) {
					const updatedTicket = await updateTicket({
						...ticket,
						teamIds: res.teamIds,
						teamEquipmentIds: res.equipIds
					});
					ticket = updatedTicket;

					toastStore.trigger({
						message: 'Ticket Assigned successfully.',
						background: 'variant-filled-success',
						timeout: 3000
					});
				}
			}
		});
	}

	function editApplication(ticket) {
		modalStore.trigger({
			type: 'component',
			component: 'editTicket',
			backdropClasses: '!bg-black/50',
			meta: { ticket, attachment, categories, categoryLevels }
		});
	}
</script>

<div class="btn-group variant-filled-primary h-10">
	<button
		type="button"
		class="w-1/3"
		on:click={() => editApplication(ticket)}
		disabled={role !== 'admin' || ticket.status === 'CLOSED'}
	>
		Update
	</button>

	<button
		type="button"
		class="w-1/3"
		on:click={() => assignTicket()}
		disabled={role !== 'admin' || ticket.status === 'CLOSED'}
	>
		Assign
	</button>

	<button
		type="button"
		class="w-1/3"
		disabled={role !== 'admin'}
		on:click={() =>
			ticket.status === 'CLOSED' || ticket.status === 'COMPLETE' ? reOpenTicket() : closeTicket()}
	>
		{`${ticket.status === 'CLOSED' || ticket.status === 'COMPLETE' ? 'Re-open' : 'Close'}`}
	</button>
</div>
