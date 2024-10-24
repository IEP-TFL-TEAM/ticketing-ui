<script>
	import EmailInput from './EmailInput.svelte';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { sendBroadcastEmail } from '$lib/api/tickets';
	import { parseDateAndTime } from '$lib/utils/parsers';

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	const ticket = $modalStore[0].meta.ticket;
	let emails = [];
	let update;
	let errors;
	let loading = false;

	async function onSendBroadcast() {
		loading = true;
		errors = null;

		const teamNames = ticket.expand?.teamIds.map((team) => team.name || []);
		const teams = teamNames.join(', ');

		for (const email of emails) {
			try {
				await sendBroadcastEmail({
					id: ticket.id,
					email,
					cc: 'testcc@gmail.com',
					subject: ticket.title,
					incidentStart: parseDateAndTime(ticket.incidentStart),
					description: ticket.description,
					location: ticket.expand?.siteId?.name,
					assignedTeams: teams,
					update: !update || update.length === 0 ? '...' : update,
					ticketNumber: ticket.ticketNumber
				});

				toastStore.trigger({
					message: `Broadcast Sent Successfully to ${email}`,
					background: 'variant-filled-success'
				});

				emails = emails.filter((e) => e !== email);
			} catch (error) {
				errors = error.response.details;
			}
		}

		update = null;
		loading = false;
	}
</script>

<div class="max-w-xl w-full p-10 bg-white dark:bg-neutral-800">
	<div class="flex flex-col gap-2 mb-5">
		<span class="text-2xl font-semibold tracking-wide">
			Send Broadcast Email for incident <span class="text-primary-500 dark:text-tertiary-500">
				{ticket.ticketNumber}
			</span>
		</span>

		<span class="font-extralight text-gray-500 dark:text-white">
			Manage Emails to Send Broadcast To
		</span>
	</div>

	<hr class="!border-gray-200 dark:!border-gray-200/30 my-5" />

	<div class="flex flex-col my-5 gap-2">
		<div>
			<span class="text-lg">Invite with email</span>
		</div>
		<EmailInput bind:emails bind:loading />

		<div class="flex flex-col gap-2 mt-4">
			<span class="text-lg">Provide an update below if any</span>

			<form method="POST" enctype="multipart/form-data" class="w-full rounded-lg mt-4">
				<textarea
					class="textarea p-2"
					name="update"
					bind:value={update}
					disabled={loading}
					placeholder="Provide an update here ..."
					type="text"
					rows="2"
				/>
			</form>
		</div>
	</div>

	{#if errors}
		<div class="flex items-center justify-between">
			<span class="text-red-500 text-sm">{errors}</span>
		</div>
	{/if}
	<div class="flex justify-end">
		<button
			type="submit"
			disabled={emails.length === 0 || loading}
			on:click={() => onSendBroadcast()}
			class="btn variant-filled dark:variant-filled-tertiary rounded-sm p-1.5 px-5 mb-2"
		>
			{loading ? 'Sending ...' : 'Send'}
		</button>
	</div>
</div>
