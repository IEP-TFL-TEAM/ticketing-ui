<script>
	import { Avatar, getModalStore } from '@skeletonlabs/skeleton';
	import { toZonedTime } from 'date-fns-tz';
	import { lazyLoad } from '$lib/actions/lazyLoad.js';
	import { IconDownload, IconMaximize } from '@tabler/icons-svelte';

	export let avatar, content, date, firstName, lastName;
	export let attachmentUrl;
	export const attachment = '';

	const modalStore = getModalStore();

	function onClickView(imageSrc) {
		modalStore.trigger({
			type: 'component',
			component: 'viewImage',
			backdropClasses: '!bg-black/80',
			meta: { imageSrc }
		});
	}
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
					class="inline-flex items-center mr-3 text-sm text-primary-500 dark:text-tertiary-500 font-semibold"
				>
					{firstName + ' ' + lastName}
				</span>

				<span class="text-sm">{content}</span>
			</div>

			{#if attachmentUrl}
				<div class="flex items-center justify-between gap-4 mb-2 text-sm">
					<div />

					<div class="flex gap-2">
						<a href={attachmentUrl + '&download=1'} download>
							<IconDownload size={30} />
						</a>

						<button
							type="button"
							on:click={() => onClickView(attachmentUrl)}
							class="cursor-pointer"
						>
							<IconMaximize size={30} />
						</button>
					</div>
				</div>

				<div class="pt-4">
					<img
						use:lazyLoad={attachmentUrl}
						class="transition duration-500 opacity-0 w-full object-contain h-[20rem]"
						alt="_"
					/>
				</div>
			{/if}
		</div>

		<div class="w-full">
			<span class="text-sm text-secondary-900 dark:text-secondary-500">
				{toZonedTime(date, 'Pacific/Fiji')}
			</span>
		</div>
	</div>
</div>
