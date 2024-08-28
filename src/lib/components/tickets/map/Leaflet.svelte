<script>
	import { onMount, onDestroy, setContext, createEventDispatcher, tick } from 'svelte';
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';

	export let bounds, view, zoom;

	const dispatch = createEventDispatcher();

	let map;
	let mapElement;

	setContext('map', {
		getMap: () => map
	});

	onMount(() => {
		if (!bounds && (!view || !zoom)) {
			throw new Error('Must set either bounds, or view and zoom.');
		}

		map = L.map(mapElement)
			.on('zoom', (e) => dispatch('zoom', e))
			.on('popupopen', async (e) => {
				await tick();
				e.popup.update();
			});

		L.tileLayer(`${import.meta.env.VITE_MAP_IMG}`, {
			attribution: `${import.meta.env.VITE_MAP_ATTRIBUTION}`
		}).addTo(map);
	});

	onDestroy(() => {
		map?.remove();
		map = undefined;
	});

	$: if (map) {
		if (bounds) {
			map.fitBounds(bounds);
		} else if (view && zoom) {
			map.setView(view, zoom);
		}
	}
</script>

<div class="w-full h-full z-0" bind:this={mapElement}>
	{#if map}
		<slot />
	{/if}
</div>
