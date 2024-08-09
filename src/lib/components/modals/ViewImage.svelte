<script>
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { lazyLoad } from '$lib/actions/lazyLoad.js';
	import { IconX } from '@tabler/icons-svelte';

	export let parent;

	const modalStore = getModalStore();
	const imageSrc = $modalStore[0].meta.imageSrc;

	const cButton = 'fixed top-4 right-4 z-50 font-bold shadow-xl';
	const cImage =
		'max-w-[35%] max-h-[35%] rounded-container-token shadow-xl transition duration-500 opacity-0';
</script>

{#if $modalStore[0]}
	<button
		class=" p-3 rounded-full border border-neutral-400 hover:border-none hover:cursor-pointer text-white hover:bg-black/60 dark:hover:bg-white/20 transition-all {cButton}"
		on:click={parent.onClose}
	>
		<IconX size={25} />
	</button>

	<img use:lazyLoad={imageSrc} class={cImage + ' overflow-y-auto'} alt="_" />
{/if}
