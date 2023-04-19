<script lang="ts">
	import { onMount } from 'svelte';
	import leaflet from 'leaflet';
	import type { Enclosure } from '$lib/core/Domain';
	import { getColorList } from '$lib/core/functions';
	import Card from './Card.svelte';

	let mapElement: any;
	let i = 0;
	export let enclosures: Enclosure[] = [];
	const colorList = getColorList(enclosures.length);

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
						fillColor: colorList[i++],
						weight: 2,
						opacity: 1,
						color: 'black',
						fillOpacity: 0.7,
						pane: 'markerPane'
					};
				}
			})
			.addTo(map)
			.bindPopup((e: any) => e.feature.id);

		// Fits map to all features present automatically
		map.fitBounds(features.getBounds(), { padding: [25, 25] }).setMaxZoom(17);

		return () => map.remove();
	});
</script>

<section>
	<Card height="100%">
		<div slot="body" bind:this={mapElement} />
	</Card>
</section>

<style lang="scss">
	section {
		grid-area: map;

		div {
			min-height: 200px;
			height: 100%;
		}
	}
</style>
