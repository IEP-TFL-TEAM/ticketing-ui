<script>
	import { Avatar } from '@skeletonlabs/skeleton';
	import { toZonedTime } from 'date-fns-tz';
	import TicketAttachments from '../tickets/TicketAttachments.svelte';

	export let avatar, content, date, firstName, lastName;
	export let attachmentUrl, attachment;
</script>

<div class="w-full flex items-start justify-start gap-2 mb-6">
	<div>
		<Avatar
			src={avatar}
			initials={firstName.charAt(0) + lastName.charAt(0)}
			width="w-12"
			rounded="rounded-full"
			border="border border-gray-500 dark:border-gray-300 hover:!border-secondary-500 dark:hover:border-primary-500"
			background="bg-transparent"
		/>
	</div>

	<div class="flex flex-col w-full">
		<div class="w-full text-base bg-neutral-200 dark:bg-neutral-700 p-2 rounded-lg">
			<div class="flex flex-col gap-2 justify-start items-start">
				<span
					class="inline-flex items-center mr-3 text-base text-primary-500 dark:text-tertiary-500 font-semibold"
				>
					{firstName + ' ' + lastName}
				</span>

				<span class="text-base">{content}</span>
			</div>

			{#if attachmentUrl}
				<TicketAttachments {attachmentUrl} {attachment} />
			{/if}
		</div>

		<div class="w-full">
			<span class="text-sm text-secondary-900 dark:text-secondary-500">
				{toZonedTime(date, 'Pacific/Fiji')}
			</span>
		</div>
	</div>
</div>
