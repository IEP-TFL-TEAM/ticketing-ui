<script>
	import { currentUser } from '$lib/stores/auth';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { toZonedTime } from 'date-fns-tz';
	import TicketAttachments from '../tickets/TicketAttachments.svelte';

	export let avatar, content, date, firstName, lastName;
	export let attachmentUrl, attachment;

	$: isUsersOwnComment = $currentUser.firstName === firstName && $currentUser.lastName === lastName;
</script>

<div class="w-full mb-6 pr-4">
	<div class="grid grid-cols-[auto_1fr] gap-2">
		<Avatar
			src={avatar}
			initials={firstName.charAt(0) + lastName.charAt(0)}
			width="w-12"
			rounded="rounded-full"
			border="border {isUsersOwnComment
				? 'border-primary-500'
				: 'border-gray-500 dark:border-gray-300 hover:!border-secondary-500 dark:hover:border-primary-500'}"
			background="bg-transparent"
		/>

		<div
			class="card p-4 variant-soft rounded-tl-none rounded-lg space-y-2 {isUsersOwnComment
				? 'bg-white border-2 border-primary-500/40 dark:bg-black/20 dark:border-primary-900/70'
				: 'bg-white dark:bg-black/20 border dark:border-white/20'}"
		>
			<header class="flex justify-between items-center">
				<p class="font-bold">{firstName + ' ' + lastName}</p>
				<small class="opacity-90 text-primary-700 dark:text-tertiary-500">
					{toZonedTime(date, 'Pacific/Fiji')}
				</small>
			</header>

			{#if isUsersOwnComment}
				<p>{content}</p>
			{:else}
				<blockquote class="blockquote">{content}</blockquote>
			{/if}

			{#if attachmentUrl}
				<TicketAttachments {attachmentUrl} {attachment} />
			{/if}
		</div>
	</div>
</div>
