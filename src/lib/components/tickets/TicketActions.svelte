<script>
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { updateTicket } from '$lib/api/tickets';
	import { currentUser } from '$lib/stores/auth';

	export let ticket, teams, solutionCodes, causeCodes;

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
						closingRemarks: ''
					});
					ticket = updatedTicket;

					toastStore.trigger({
						message: 'Ticket Reopened successfully.',
						background: 'variant-filled-success'
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
			body: 'Select a team to assign to',
			meta: { teams },
			response: async (team) => {
				if (team) {
					const updatedTicket = await updateTicket({
						...ticket,
						teamId: team.id
					});
					ticket = updatedTicket;

					toastStore.trigger({
						message: 'Ticket Assigned successfully.',
						background: 'variant-filled-success'
					});
				}
			}
		});
	}
</script>

<div class="btn-group variant-filled-primary h-10">
	<button
		type="button"
		class="w-1/2"
		on:click={() => assignTicket()}
		disabled={role !== 'admin' || ticket.status === 'CLOSED'}
	>
		Assign
	</button>

	<button
		type="button"
		class="1/2"
		disabled={role !== 'admin'}
		on:click={() =>
			ticket.status === 'CLOSED' || ticket.status === 'COMPLETE' ? reOpenTicket() : closeTicket()}
	>
		{`${ticket.status === 'CLOSED' || ticket.status === 'COMPLETE' ? 'Re-open' : 'Close'}`}
	</button>
</div>
