<!-- https://js.do/code/166021: for clustering polygons -->

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import leaflet from 'leaflet';
	import type { Enclosure } from '$lib/core/Domain';
	import Card from './Card.svelte';
	import 'leaflet.markercluster';
	import { getColor } from '$lib/core/functions';

	export let enclosures: Enclosure[] | undefined = undefined;
	let map: leaflet.Map;
	let mapElement: any;
	let i = 0;

	onMount(() => {
		if (!enclosures) return;
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
		// .bindPopup((e) => e.feature.properties.popupContent);

		// Compute polygon center and add it to _latlng
		leaflet.Polygon.addInitHook(function () {
			this._latlng = this.getBounds().getCenter();
		});

		// Get getLatLngs() and setLatLngs() functions
		leaflet.Polygon.include({
			getLatLng: function () {
				return this._latlng;
			},
			setLatLng: function () {}
		});

		// Add marker cluster
		const markers = leaflet.markerClusterGroup().addTo(map);
		const geojsonFeatures = {
			type: 'FeatureCollection',
			features: enclosures
		} as any;

		const features = leaflet.geoJSON(geojsonFeatures, {
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
		});
		markers.addLayer(features);
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
