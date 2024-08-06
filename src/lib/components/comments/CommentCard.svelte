<script>
	import { Avatar } from '@skeletonlabs/skeleton';
	import { toZonedTime } from 'date-fns-tz';

	export let avatar, content, date, name;
</script>

<div class="w-full p-2 text-base border-b border-gray-300">
	<div class="flex items-end">
		<Avatar src={avatar} width="w-8" rounded="rounded-lg" />
		<span class="inline-flex pl-4 items-center mr-3 text-xs">{name}</span>
		<span class="text-xs text-gray-600 dark:text-secondary-500">
			{toZonedTime(date, 'Pacific/Fiji')}
		</span>
	</div>

	<div class="flex flex-col">
		<span class="pt-5 text-xs">{content}</span>
	</div>
</div>
