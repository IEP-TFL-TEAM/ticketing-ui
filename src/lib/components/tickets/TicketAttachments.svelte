<script>
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { IconMaximize, IconDownload } from '@tabler/icons-svelte';
	import { lazyLoad } from '$lib/actions/lazyLoad.js';

	export let attachmentUrl, attachment;

	const modalStore = getModalStore();

	function onClickView(imageSrc) {
		modalStore.trigger({
			type: 'component',
			component: 'viewImage',
			backdropClasses: '!bg-black/80',
			meta: { imageSrc }
		});
	}

	function onClickViewFile(fileSrc) {
		const modal = {
			type: 'component',
			component: 'viewFile',
			meta: { fileSrc }
		};
		modalStore.trigger(modal);
	}
</script>

<div>
	{#if (attachment.type !== 'image/jpg') & (attachment.type !== 'image/png') & (attachment.type !== 'image/jpeg')}
		<div class="flex flex-col justify-between xl:flex-row pt-4 gap-y-2">
			<span class="text-primary-600 dark:text-tertiary-500">{attachment.name}</span>

			<div class="flex justify-between items-center gap-2">
				<a href={attachmentUrl + '&download=1'} download>
					<IconDownload size={30} />
				</a>

				{#if attachment.type === 'application/pdf'}
					<button
						type="button"
						on:click={() => onClickViewFile(attachmentUrl)}
						class="cursor-pointer"
					>
						<IconMaximize size={30} />
					</button>
				{/if}
			</div>
		</div>
	{:else}
		<div>
			<div class="flex justify-end items-center gap-2">
				<a href={attachmentUrl + '&download=1'} download>
					<IconDownload size={30} />
				</a>

				<button type="button" on:click={() => onClickView(attachmentUrl)} class="cursor-pointer">
					<IconMaximize size={30} />
				</button>
			</div>

			<img
				use:lazyLoad={attachmentUrl}
				class="transition duration-500 opacity-0 w-full object-contain h-[20rem]"
				alt="_"
			/>
		</div>
	{/if}
</div>
