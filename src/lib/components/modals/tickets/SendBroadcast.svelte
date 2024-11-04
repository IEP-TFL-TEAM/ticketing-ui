<script>
	import Svelecte from 'svelecte';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { sendBroadcastEmail } from '$lib/api/tickets';
	import { parseDateAndTime } from '$lib/utils/parsers';
	import { broadcastTypes } from '$lib/utils';

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	const ticket = $modalStore[0].meta.ticket;
	const verifiedRecipients = $modalStore[0].meta.verifiedRecipients;

	let verifiedEmails = [];
	let emails = [];
	let ccEmail;
	let typeOfBroadcast;
	let update;
	let errors;
	let loading = false;

	function isValidEmail(email) {
		// Basic email validation regex
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	async function onSendBroadcast() {
		loading = true;
		errors = null;

		if (!isValidEmail(ccEmail)) {
			loading = false;

			let message = 'CC Email must be an email';
			errors = message;

			toastStore.trigger({
				message,
				background: 'variant-filled-error'
			});
			return;
		}

		if (!typeOfBroadcast) {
			loading = false;

			let message = 'Type of Broadcast cannot be empty';
			errors = message;
			toastStore.trigger({
				message,
				background: 'variant-filled-error'
			});
			return;
		}

		if (!update) {
			loading = false;

			let message = 'Update cannot be empty';
			errors = message;
			toastStore.trigger({
				message,
				background: 'variant-filled-error'
			});
			return;
		}

		const teamNames = ticket.expand?.teamIds.map((team) => team.name || []);
		const teams = teamNames.join(', ');

		for (const email of emails) {
			try {
				await sendBroadcastEmail({
					id: ticket.id,
					email,
					cc: ccEmail,
					subject: ticket.title,
					incidentStart: parseDateAndTime(ticket.incidentStart),
					incidentEnd:
						typeOfBroadcast === 'Service Restoration Notice'
							? parseDateAndTime(ticket.incidentEnd)
							: 'N/A',
					description: ticket.description,
					location: ticket.expand?.siteId?.name,
					assignedTeams: teams,
					update,
					ticketNumber: ticket.ticketNumber,
					broadcastType: typeOfBroadcast
				});

				toastStore.trigger({
					message: `Broadcast Sent Successfully to ${email}`,
					background: 'variant-filled-success',
					classes: 'rounded-none font-semibold'
				});

				emails = emails.filter((e) => e !== email);
			} catch (error) {
				errors = error.response.details;
			}
		}

		update = null;
		ccEmail = null;
		typeOfBroadcast = null;
		loading = false;
	}

	$: verifiedEmails = verifiedRecipients.map((item) => item.email);
	$: ticket.status === 'CLOSED' ? broadcastTypes.push('Service Restoration Notice') : '';

	const customInputStyle =
		'!bg-white dark:!bg-neutral-800 placeholder-primary-500 dark:placeholder-tertiary-500 text-sm flex-grow border border-gray-300 dark:border-gray-200/30 rounded-none !focus:outline-none !focus:ring-0 !focus:ring-offset-0';
</script>

<div
	class="max-w-xl w-full p-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700"
>
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
		<p class="my-2 text-base font-semibold">
			Select email(s) below
			<span class="text-red-500">*</span>
		</p>

		<Svelecte
			options={verifiedEmails}
			bind:value={emails}
			multiple
			disabled={loading}
			class="!text-primary-500 dark:!text-tertiary-500"
		/>

		<form method="POST" enctype="multipart/form-data" class="w-full flex flex-col gap-2">
			<label class="label">
				<p class="my-3 text-base font-semibold">
					Enter an email to CC
					<span class="text-red-500">*</span>
				</p>
				<div class="flex flex-row">
					<input
						class="input p-2 {customInputStyle}"
						type="email"
						name="ccEmail"
						bind:value={ccEmail}
						required
						disabled={loading}
						placeholder="Please enter an email to cc"
					/>
				</div>
			</label>

			<label class="label">
				<p class="my-3 text-base font-semibold">
					Type of Broadcast
					<span class="text-red-500">*</span>
				</p>
				<div class="flex flex-row">
					<select
						class="select rounded-none w-full"
						name="typeOfBroadcast"
						bind:value={typeOfBroadcast}
						disabled={loading}
						required
					>
						<option value={null} disabled selected>
							<span class="!text-gray-500">-- select type of broadcast --</span>
						</option>
						{#each broadcastTypes as item}
							<option value={item}>
								{item}
							</option>
						{/each}
					</select>
				</div>
			</label>

			<label class="label">
				<p class="my-3 text-base font-semibold">
					Please, provide an update below
					<span class="text-red-500">*</span>
				</p>
				<div class="flex flex-row">
					<textarea
						class="textarea p-2 {customInputStyle}"
						name="update"
						bind:value={update}
						required
						placeholder="Provide an update here ..."
						type="text"
						rows="4"
						disabled={loading}
					/>
				</div>
			</label>

			<div>
				{#if errors}
					<div class="flex items-center justify-between">
						<span class="text-red-500 text-sm uppercase font-medium">{errors}</span>
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
		</form>
	</div>
</div>
