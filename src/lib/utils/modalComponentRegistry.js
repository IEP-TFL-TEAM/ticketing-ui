import ViewImage from '$lib/components/modals/ViewImage.svelte';
import ViewFile from '$lib/components/modals/ViewFile.svelte';
import AssignTicket from '$lib/components/modals/tickets/AssignTicket.svelte';
import RecipientActions from '$lib/components/modals/recipients/RecipientActions.svelte';

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
	}
};
