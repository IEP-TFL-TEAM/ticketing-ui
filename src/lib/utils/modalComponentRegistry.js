import ViewImage from '$lib/components/modals/ViewImage.svelte';
import ViewFile from '$lib/components/modals/ViewFile.svelte';
import AssignTicket from '$lib/components/modals/tickets/AssignTicket.svelte';
import CloseTicket from '$lib/components/modals/tickets/CloseTicket.svelte';
import EditTicket from '$lib/components/modals/tickets/EditTicket.svelte';
import SendBroadcast from '$lib/components/modals/tickets/SendBroadcast.svelte';
import RecipientActions from '$lib/components/modals/recipients/RecipientActions.svelte';
import EditChangeRequest from '$lib/components/modals/change-requests/EditChangeRequest.svelte';
import CloseRequest from '$lib/components/modals/change-requests/CloseRequest.svelte';
import EditRoutineMaintenance from '$lib/components/modals/routine-maintenance/EditRoutineMaintenance.svelte';
import CloseRoutine from '$lib/components/modals/routine-maintenance/CloseRoutine.svelte';

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
	closeTicket: {
		ref: CloseTicket
	},
	editChangeRequest: {
		ref: EditChangeRequest
	},
	closeRequest: {
		ref: CloseRequest
	},
	editRoutineMaintenance: {
		ref: EditRoutineMaintenance
	},
	closeRoutine: {
		ref: CloseRoutine
	},
	editTicket: {
		ref: EditTicket
	},
	sendBroadcast: {
		ref: SendBroadcast
	}
};
