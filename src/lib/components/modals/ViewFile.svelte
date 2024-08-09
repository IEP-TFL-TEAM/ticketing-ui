<script>
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { IconX } from '@tabler/icons-svelte';

	export let parent;

	const modalStore = getModalStore();
	const fileSrc = $modalStore[0].meta.fileSrc;

	const cButton = 'fixed top-4 right-4 z-50 font-bold shadow-xl';
</script>

{#if $modalStore[0]}
	<button
		class=" p-3 rounded-full border border-neutral-400 hover:border-none hover:cursor-pointer text-white hover:bg-black/60 dark:hover:bg-white/20 transition-all {cButton}"
		on:click={parent.onClose}
	>
		<IconX size={25} />
	</button>

	<iframe
		src={fileSrc}
		title="file-preview"
		class=" w-screen h-screen p-[4rem]"
		frameborder="0"
		allowfullscreen
	></iframe>
{/if}
