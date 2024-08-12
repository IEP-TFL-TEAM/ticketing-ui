<script>
	import 'swiper/swiper-bundle.css';

	import { onDestroy, onMount } from 'svelte';
	import Swiper from 'swiper';
	import { photos } from '$lib/stores/photoStore';
	import { parsePhotos } from '$lib/utils/parsers';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { IconMaximize } from '@tabler/icons-svelte';

	const modalStore = getModalStore();

	$: images = parsePhotos($photos);

	let mySwiper;

	function onClickView(imageSrc) {
		modalStore.trigger({
			type: 'component',
			component: 'viewImage',
			meta: { imageSrc }
		});
	}

	onMount(() => {
		if (!mySwiper) {
			mySwiper = new Swiper('.swiper-container', {
				navigation: {
					enabled: true,
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev'
				}
			});
		}
	});

	onDestroy(() => {
		if (mySwiper) {
			mySwiper.destroy(true, true);
			mySwiper = undefined;
		}
	});
</script>

<div class="flex flex-col items-center justify-center relative">
	<div id="container" class="swiper-container w-[630px] overflow-hidden">
		<div class="swiper-wrapper">
			{#if images.length > 0}
				{#each images as image}
					<div class="swiper-slide">
						<img src={image.url} class="object-contain w-full h-full" alt="test" />
					</div>
				{/each}
			{:else}
				<p>No images to show</p>
			{/if}
		</div>

		{#if images.length > 1}
			<button
				class="swiper-button-prev absolute top-0 right-0 m-4 text-white z-10"
				on:click={() => {
					mySwiper.slidePrev();
				}}
			/>

			<button
				class="swiper-button-next absolute top-0 right-0 m-4 text-white z-10"
				on:click={() => {
					mySwiper.slideNext();
				}}
			/>
		{/if}

		{#if images.length > 0}
			<button class="absolute top-0 right-0 text-white z-10" on:click={() => onClickView()}>
				<IconMaximize />
			</button>
		{/if}
	</div>
</div>
