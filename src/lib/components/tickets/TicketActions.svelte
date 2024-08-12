<script>
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { updateTicket } from '$lib/api/tickets';
	import { currentUser } from '$lib/stores/auth';

	const modalStore = getModalStore();

	export let ticket, teams;

	$: role = $currentUser?.role;

	async function approveTicket() {
		modalStore.trigger({
			type: 'confirm',
			title: 'Resolve this ticket',
			body: 'Have you confirmed that this job is complete and should be verified?',
			response: async (r) => {
				if (r) {
					const updatedTicket = await updateTicket({
						...ticket,
						status: 'APPROVED'
					});
					ticket = updatedTicket;
				}
			}
		});
	}

	// async function verifyTicket() {
	// 	modalStore.trigger({
	// 		type: 'confirm',
	// 		title: 'Complete this ticket',
	// 		body: 'Have you confirmed with the client this ticket is complete?',
	// 		response: async (r) => {
	// 			if (r) {
	// 				const updatedTicket = await updateTicket({
	// 					...ticket,
	// 					status: 'COMPLETE'
	// 				});
	// 				ticket = updatedTicket;
	// 			}
	// 		}
	// 	});
	// }

	async function reOpenTicket() {
		modalStore.trigger({
			type: 'confirm',
			title: 'Re-open this ticket',
			body: 'Are you sure you wish to proceed? This action will revert the status of the ticket to pending',
			response: async (r) => {
				if (r) {
					const updatedTicket = await updateTicket({
						...ticket,
						status: 'PENDING'
					});
					ticket = updatedTicket;
				}
			}
		});
	}

	async function closeTicket() {
		modalStore.trigger({
			type: 'confirm',
			title: 'Close this ticket',
			body: 'Are you sure you wish to proceed?',
			response: async (r) => {
				if (r) {
					const updatedTicket = await updateTicket({
						...ticket,
						status: 'CLOSED'
					});
					ticket = updatedTicket;
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
				}
			}
		});
	}
</script>

<div class="btn-group variant-filled-primary h-10">
	<button type="button" class="w-1/3" on:click={() => assignTicket()} disabled={role !== 'admin'}>
		Assign
	</button>

	<!-- <button -->
	<!-- 	type="button" -->
	<!-- 	class="w-1/4" -->
	<!-- 	on:click={() => verifyTicket()} -->
	<!-- 	disabled={ticket.status !== 'RESOLVED' || (role !== 'admin')} -->
	<!-- > -->
	<!-- 	Verify -->
	<!-- </button> -->

	<button
		type="button"
		class="w-1/3"
		on:click={() => approveTicket()}
		disabled={role !== 'admin' || ticket.status === 'APPROVED' || ticket.status === 'CLOSED'}
	>
		Approve
	</button>

	<button
		type="button"
		class="1/3"
		disabled={role !== 'admin'}
		on:click={() =>
			ticket.status === 'CLOSED' || ticket.status === 'COMPLETE' ? reOpenTicket() : closeTicket()}
	>
		{`${ticket.status === 'CLOSED' || ticket.status === 'COMPLETE' ? 'Re-open' : 'Close'}`}
	</button>
</div>
