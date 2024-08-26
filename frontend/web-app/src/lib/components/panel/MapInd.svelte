<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import leaflet from 'leaflet';
	import type { DigitalTwin } from '$lib/core/Domain';
	import { getColor } from '$lib/core/functions';

	let mapElement: any;
	let map: leaflet.Map;
	let i = 0;
	export let endDate = new Date().toISOString().split('T')[0];
	let startDate: string;
	// endate minus 7 days
	$: {
		if (endDate) {
			startDate = new Date(new Date(endDate).setDate(new Date(endDate).getDate() - 7))
				.toISOString()
				.split('T')[0];
		}
	}

	export let digitalTwin: DigitalTwin;

	$: {
		if (map) {
			try {
				// Remove previous markers
				map.eachLayer((layer) => {
					if (layer instanceof leaflet.GeoJSON) {
						map.removeLayer(layer);
					}
					if (layer instanceof leaflet.TileLayer) {
						map.removeLayer(layer);
					}
				});
				const features = leaflet
					.geoJSON(digitalTwin.geometry as any, {
						style: (feature) => {
							return {
								fillColor: getColor(i++),
								weight: 4,
								opacity: 1,
								color: 'black',
								fillOpacity: 0.05,
								pane: 'markerPane'
							};
						}
					})
					.addTo(map);

				leaflet.tileLayer
					.wms(
						`https://services.sentinel-hub.com/ogc/wms/981976b3-d724-45bb-856b-08d4d9c99848?time=${startDate}/${endDate}&CRS=EPSG:4326&FORMAT=image/png&layers=NDVI&transparent=TRUE`,
						{
							layers: 'NDVI',
							format: 'image/png',
							transparent: true,
							opacity: 0.85,
							attribution: 'Sentinel Hub',
							crs: leaflet.CRS.EPSG4326
						}
					)
					.addTo(map);

				// Fits map to all features present automatically
				map.fitBounds(features.getBounds()).setMaxZoom(17).setMinZoom(16);
				// Set dragging to false
				map.dragging.disable();
				// Disable mouse wheel zoom
				map.scrollWheelZoom.disable();
			} catch (error) {
				console.log('Error setting map bounds');
			}
		}
	}

	onMount(() => {
		map = leaflet.map(mapElement);
		return () => {
			map.remove();
		};
	});
</script>

<div class="card" bind:this={mapElement} />

<style lang="scss">
	div {
		width: 100%;
		height: 100%;
	}
</style>
