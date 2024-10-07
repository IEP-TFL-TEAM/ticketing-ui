import ViewImage from '$lib/components/modals/ViewImage.svelte';
import ViewFile from '$lib/components/modals/ViewFile.svelte';
import AssignTicket from '$lib/components/modals/tickets/AssignTicket.svelte';
import CloseTicket from '$lib/components/modals/tickets/CloseTicket.svelte';
import RecipientActions from '$lib/components/modals/recipients/RecipientActions.svelte';
import TeamActions from '$lib/components/modals/teams/TeamActions.svelte';
import EditChangeRequest from '$lib/components/modals/change-requests/EditChangeRequest.svelte';
import EditRoutineMaintenance from '$lib/components/modals/routine-maintenance/EditRoutineMaintenance.svelte';
import EditTicket from '$lib/components/modals/tickets/EditTicket.svelte';

export const modalComponentRegistry = {
	viewImage: {
		ref: ViewImage
	},
	viewFile: {
		ref: ViewFile
	},
	assignTicket: {
		ref: AssignTicket
	},
	recipientActions: {
		ref: RecipientActions
	},
	teamActions: {
		ref: TeamActions
	},
	closeTicket: {
		ref: CloseTicket
	},
	editChangeRequest: {
		ref: EditChangeRequest
	},
	editRoutineMaintenance: {
		ref: EditRoutineMaintenance
	},
	editTicket: {
		ref: EditTicket
	}
};
