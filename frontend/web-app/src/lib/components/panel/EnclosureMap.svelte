<script lang="ts">
	import { onMount } from 'svelte';
	import leaflet from 'leaflet';
	import type { Enclosure } from '$lib/core/Domain';
	import { getColorList } from '$lib/core/functions';
	import Card from './Card.svelte';

	let mapElement: any;
	let i = 0;
	export let enclosure: Enclosure;
	const colorList = getColorList(1);

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
						fillColor: colorList[i++],
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
		min-height: 200px;
		max-height: 500px;
		height: 100%;
	}
</style>
