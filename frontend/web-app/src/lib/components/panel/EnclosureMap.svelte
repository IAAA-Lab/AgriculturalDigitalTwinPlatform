<script lang="ts">
	import { onMount } from 'svelte';
	import leaflet from 'leaflet';
	import type { Enclosure } from '$lib/core/Domain';
	import Card from './Card.svelte';
	import { getColor } from '$lib/core/functions';

	let mapElement: any;
	let i = 0;
	export let enclosure: Enclosure;

	onMount(async () => {
		const map = leaflet.map(mapElement);

		leaflet
			.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			})
			.addTo(map);

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

		return () => map.remove();
	});
</script>

<Card>
	<svelte:fragment slot="body">
		<div bind:this={mapElement} />
	</svelte:fragment>
</Card>

<style lang="scss">
	div {
		min-height: 300px;
		max-height: 500px;
		height: 100%;
	}
</style>
