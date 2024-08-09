<script>
	import { Avatar } from '@skeletonlabs/skeleton';
	import { toZonedTime } from 'date-fns-tz';

	export let avatar, content, date, firstName, lastName;
</script>

<div class="w-full p-2 text-base border-b border-gray-500 dark:border-gray-300">
	<div class="flex items-center">
		<Avatar
			src={avatar}
			initials={firstName.charAt(0) + lastName.charAt(0)}
			width="w-12"
			rounded="rounded-full"
			border="border border-gray-500 dark:border-gray-300 hover:!border-secondary-500 dark:hover:border-primary-500"
			background="bg-transparent"
		/>

		<span class="inline-flex pl-4 items-center mr-3 text-sm text-primary-500 font-semibold"
			>{firstName + ' ' + lastName}</span
		>

		<span class="text-sm text-secondary-900 dark:text-secondary-500">
			{toZonedTime(date, 'Pacific/Fiji')}
		</span>
	</div>

	<div class="flex flex-col">
		<span class="pt-5 text-base">{content}</span>
	</div>
</div>
