<script>
	import { onMount, onDestroy, getContext, setContext } from 'svelte';
	import L from 'leaflet';

	export let width, height, latLng;

	const { getMap } = getContext('map');

	const map = getMap();
	let marker;
	let markerElement;

	setContext('layer', {
		getLayer: () => marker
	});

	onMount(() => {
		if (map) {
			let icon = L.divIcon({
				html: markerElement,
				className: 'map-marker',
				iconSize: L.point(width, height)
			});
			marker = L.marker(latLng, { icon }).addTo(map);
		}
	});

	onDestroy(() => {
		marker?.remove();
		marker = undefined;
	});
</script>

<div bind:this={markerElement}>
	{#if marker}
		<slot />
	{/if}
</div>
