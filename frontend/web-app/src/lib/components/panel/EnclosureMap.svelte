<script lang="ts">
	import { onMount } from 'svelte';
	import leaflet from 'leaflet';
	import type { Enclosure } from '$lib/core/Domain';
	import { getColor } from '$lib/core/functions';

	let mapElement: any;
	let map: any;
	let i = 0;
	export let enclosure: Enclosure | undefined = undefined;

	$: {
		if (enclosure) {
			const features = leaflet
				.geoJSON(enclosure as any, {
					style: (feature) => {
						return {
							fillColor: getColor(i),
							weight: 2,
							opacity: 1,
							color: 'black',
							fillOpacity: 0.7,
							pane: 'markerPane'
						};
					}
				})
				.addTo(map);
			// .bindPopup((e) => e.feature.type);

			// Fits map to all features present automatically
			map.fitBounds(features.getBounds(), { padding: [25, 25] });
		}
	}

	onMount(async () => {
		map = leaflet.map(mapElement);

		leaflet
			.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			})
			.addTo(map);

		return () => map.remove();
	});
</script>

<div class="card" bind:this={mapElement} />
