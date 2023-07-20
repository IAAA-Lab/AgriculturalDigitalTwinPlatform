<script lang="ts">
	import { onMount } from 'svelte';
	import leaflet from 'leaflet';
	import type { Enclosure } from '$lib/core/Domain';
	import { getColor } from '$lib/core/functions';

	let mapElement: any;
	let i = 0;
	export let enclosures: Enclosure[];

	onMount(async () => {
		const map = leaflet.map(mapElement);

		leaflet
			.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			})
			.addTo(map);

		const geojsonFeatures = {
			type: 'FeatureCollection',
			features: enclosures
		} as any;

		const features = leaflet
			.geoJSON(geojsonFeatures, {
				style: (feature) => {
					return {
						fillColor: getColor(i++),
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
		map.fitBounds(features.getBounds(), { padding: [25, 25] }).setMaxZoom(17);

		return () => map.remove();
	});
</script>

<div class="card" bind:this={mapElement} />

<style lang="scss">
	div {
		grid-area: map;
		min-height: 200px;
	}
</style>
