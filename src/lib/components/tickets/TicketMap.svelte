<script>
	import { onMount } from 'svelte';
	import { Map } from '@onsvisual/svelte-maps';
	import maplibre from 'maplibre-gl';
	import { Marker } from 'maplibre-gl';

	export let lng, lat;

	let map;
	let zoom;
	let center = {};

	onMount(() => {
		map.addControl(new maplibre.NavigationControl(), 'top-left');
		new Marker({ color: '#FF3B00' }).setLngLat([lng, lat]).addTo(map);
	});
</script>

<main>
	<Map
		id="map"
		style={import.meta.env.VITE_MAPTILER_API}
		location={{ lng, lat, zoom: 14 }}
		bind:map
		bind:zoom
		bind:center
	/>
</main>

<style>
	main {
		width: 100%;
		height: 100vh;
		position: relative;
	}
</style>
