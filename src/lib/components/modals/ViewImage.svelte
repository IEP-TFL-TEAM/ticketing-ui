<script>
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { lazyLoad } from '$lib/actions/lazyLoad.js';
	import { IconX } from '@tabler/icons-svelte';

	export let parent;

	const modalStore = getModalStore();
	const imageSrc = $modalStore[0].meta.imageSrc;
</script>

{#if $modalStore[0]}
	<button
		class=" p-3 rounded-full border border-gray-400 hover:border-none hover:cursor-pointer text-white hover:bg-black/60 dark:hover:bg-white/20 transition-all fixed top-4 right-4 z-50 font-bold shadow-xl"
		on:click={parent.onClose}
	>
		<IconX size={25} />
	</button>

	<img
		use:lazyLoad={imageSrc}
		class="max-w-5xl max-h-[55rem] overflow-y-auto h-full rounded-container-token shadow-xl transition duration-500 opacity-0"
		alt="_"
	/>
{/if}
