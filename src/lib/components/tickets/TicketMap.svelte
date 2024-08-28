<script>
	import { IconMapPinFilled } from '@tabler/icons-svelte';

	import Leaflet from './map/Leaflet.svelte';
	import Marker from './map/Marker.svelte';
	import Popup from './map/Popup.svelte';

	export let lng, lat, officeLocations, site;

	$: officeLocationsMarker = officeLocations.map((location) => ({
		latLng: [location.latitude, location.longitude],
		name: location.name
	}));
</script>

<div class="w-full h-screen">
	<Leaflet view={[lat, lng]} zoom={14} bounds={null}>
		<!-- Incident Marker -->
		<Marker latLng={[lat, lng]} width={40} height={40}>
			<IconMapPinFilled class="text-red-500" />

			<Popup>
				Incident at
				<span class="text-red-500 font-semibold">
					{site}
				</span>
			</Popup>
		</Marker>

		<!-- Office Locations -->
		{#each officeLocationsMarker as { latLng, name }}
			<Marker {latLng} width={40} height={40}>
				<IconMapPinFilled class="text-primary-500" />

				<Popup>
					Office Location:
					<span class="text-primary-500 font-semibold">
						{name}
					</span>
				</Popup>
			</Marker>
		{/each}
	</Leaflet>
</div>
