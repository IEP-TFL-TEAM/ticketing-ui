<script>
	import { IconMapPinFilled } from '@tabler/icons-svelte';

	import Leaflet from './map/Leaflet.svelte';
	import Marker from './map/Marker.svelte';
	import Popup from './map/Popup.svelte';

	export let lng, lat, officeLocations, site;

	function haversine(lat1, lon1, lat2, lon2) {
		const R = 6371; // Earth's radius in kilometers
		const toRad = (angle) => angle * (Math.PI / 180); // Convert degrees to radians

		const dLat = toRad(lat2 - lat1);
		const dLon = toRad(lon2 - lon1);

		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		const distanceKm = R * c;
		const distanceMeters = distanceKm * 1000;

		return {
			distanceKm: distanceKm.toFixed(2),
			distanceMeters: distanceMeters.toFixed(2)
		};
	}

	$: officeLocationsMarker = officeLocations.map((location) => {
		const distances = haversine(lat, lng, location.latitude, location.longitude);
		return {
			latLng: [location.latitude, location.longitude],
			name: location.name,
			distanceKm: distances.distanceKm,
			distanceMeters: distances.distanceMeters
		};
	});
</script>

<div class="w-full h-screen">
	<Leaflet view={[lat, lng]} zoom={14} bounds={null}>
		<!-- Incident Marker -->
		<Marker latLng={[lat, lng]} width={40} height={40}>
			<IconMapPinFilled class="text-red-500" />
			<Popup>
				<p class="font-semibold">
					Incident at
					<span class="text-red-500">
						{site}
					</span>
				</p>
			</Popup>
		</Marker>

		<!-- Office Locations -->
		{#each officeLocationsMarker as { latLng, name, distanceKm, distanceMeters }}
			<Marker {latLng} width={40} height={40}>
				<IconMapPinFilled class="text-primary-500" />
				<Popup>
					<p class="font-semibold">
						Office Location:
						<span class="text-primary-500">
							{name}
						</span>
					</p>

					<span class="font-semibold">
						Distance: {distanceKm} km ({distanceMeters} meters)
					</span>
				</Popup>
			</Marker>
		{/each}
	</Leaflet>
</div>
