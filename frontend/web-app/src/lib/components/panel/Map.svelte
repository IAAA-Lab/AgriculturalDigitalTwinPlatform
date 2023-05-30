<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import leaflet from 'leaflet';
	import type { Enclosure } from '$lib/core/Domain';
	import { getColorList } from '$lib/core/functions';
	import Card from './Card.svelte';
	import 'leaflet.markercluster';

	export let enclosures: Enclosure[] = [];
	let map: any;
	let mapElement: any;
	let i = 0;

	const colorList = getColorList(enclosures.length);

	onMount(async () => {
		map = leaflet.map(mapElement);

		const ign = leaflet.tileLayer
			.wms('https://www.ign.es/wms-inspire/ign-base?', {
				layers: 'IGNBaseTodo',
				format: 'image/png',
				transparent: true,
				attribution: 'IGN'
			})
			.addTo(map);

		const osm = leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '© OpenStreetMap'
		});

		const wms = leaflet.tileLayer
			.wms('https://servicios.itacyl.es/arcgis/services/Visor_Suelos/MapServer/WMSServer?', {
				layers: '0',
				format: 'image/png',
				transparent: true,
				opacity: 0.85,
				attribution: 'ITACyL'
			})
			.addTo(map);

		const baseMaps = {
			IGN: ign,
			OSM: osm
		};

		const overlayMaps = {
			'Suelos ITACyL': wms
		};

		leaflet.control.layers(baseMaps, overlayMaps).addTo(map);

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
			.bindPopup((e) => e.feature.properties.popupContent);

		// Compute a polygon "center", use your favorite algorithm (centroid, etc.)
		leaflet.Polygon.addInitHook(function () {
			this._latlng = this._bounds.getCenter();
		});

		// Provide getLatLng and setLatLng methods for Leaflet.markercluster to be able to cluster polygons.
		leaflet.Polygon.include({
			getLatLng: function () {
				return this._latlng;
			},
			setLatLng: function () {} // Dummy method.
		});

		// Create a marker cluster group.
		const markers = leaflet.markerClusterGroup().addTo(map);
		markers.addLayers(features.getLayers());

		map.fitBounds(markers.getBounds());
	});

	onDestroy(async () => {
		if (map) {
			map.remove();
		}
	});
</script>

<Card>
	<svelte:fragment slot="body">
		<div bind:this={mapElement} />
	</svelte:fragment>
</Card>

<style lang="scss">
	div {
		min-width: 250px;
		min-height: 350px;
		height: 100%;
	}
</style>
