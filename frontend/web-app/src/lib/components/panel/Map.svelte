<!-- https://js.do/code/166021: for clustering polygons -->

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import leaflet from 'leaflet';
	import type { Enclosure } from '$lib/core/Domain';
	import 'leaflet.markercluster';
	import { formattedDate, formattedTime, getColor, numberWithCommas } from '$lib/core/functions';
	import mapStore from '../../../routes/panel/(map)/store';
	import '$lib/components/panel/Leaflet.Control.Custom';

	let map: leaflet.Map;
	let mapElement: any;
	let i = 0;
	export let enclosures: Enclosure[] | undefined;
	export let distance = 100;

	$: {
		// Update map markers
		if (enclosures && enclosures.length > 0 && map) {
			// Remove previous markers
			map.eachLayer((layer) => {
				if (layer instanceof leaflet.MarkerClusterGroup) {
					map.removeLayer(layer);
				}
				if (layer instanceof leaflet.GeoJSON) {
					map.removeLayer(layer);
				}
			});
			const geojsonFeatures = {
				type: 'FeatureCollection',
				features: enclosures
			} as any;

			const features = leaflet.geoJSON(geojsonFeatures, {
				style: (feature) => {
					return {
						fillColor: $mapStore.selectedEnclosure
							? feature?.id === $mapStore.selectedEnclosure?.id
								? 'red'
								: 'grey'
							: getColor(i++),
						weight: 2,
						opacity: 1,
						color: 'black',
						fillOpacity: 0.2,
						pane: 'markerPane'
					};
				},
				onEachFeature: (feature, layer) => {
					if ($mapStore.selectedEnclosure)
						layer.bindTooltip(
							layer.feature?.properties?.activities
								?.map((activity) => tooltipContent(activity))
								?.join('<br>'),
							{
								permanent: true
							}
						);
					layer.on('click', (e) => {
						// Set selected enclosure
						mapStore.set({
							flyToCoords: $mapStore.flyToCoords,
							selectedEnclosure: feature as Enclosure
						});
					});
				}
			});
			if (enclosures.length > 20) {
				const markers = leaflet.markerClusterGroup().addTo(map);
				markers.addLayer(features);
				map.fitBounds(markers.getBounds());
				map.eachLayer((layer) => {
					if (layer instanceof leaflet.Control.Layers) {
						// Update function center map
						layer._container.querySelector('.leaflet-center').addEventListener('click', () => {
							console.log('center');
							map.fitBounds(markers.getBounds());
						});
					}
				});
			} else {
				features.addTo(map);
				map.fitBounds(features.getBounds());

				map.eachLayer((layer) => {
					if (layer instanceof leaflet.Control.Layers) {
						// Update function center map
						layer._container.querySelector('.leaflet-center').addEventListener('click', () => {
							console.log('center');
							map.fitBounds(features.getBounds());
						});
					}
				});
			}
		}
	}

	onMount(() => {
		map = leaflet.map(mapElement);
		const ign = leaflet.tileLayer.wms('https://www.ign.es/wms-inspire/ign-base?', {
			layers: 'IGNBaseTodo',
			format: 'image/png',
			transparent: true,
			// Spain crs
			crs: leaflet.CRS.EPSG4326,
			attribution: 'IGN'
		});

		const osm = leaflet
			.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
				attribution: '© OpenStreetMap'
			})
			.addTo(map);

		const wms = leaflet.tileLayer.wms(
			'https://servicios.itacyl.es/arcgis/services/Visor_Suelos/MapServer/WMSServer?',
			{
				layers: '0',
				format: 'image/png',
				transparent: true,
				opacity: 0.85,
				attribution: 'ITACyL'
			}
		);

		const wmsSentinel2 = leaflet.tileLayer.wms(
			'https://services.sentinel-hub.com/ogc/wms/981976b3-d724-45bb-856b-08d4d9c99848',
			{
				layers: 'NDVI',
				format: 'image/png',
				transparent: true,
				opacity: 0.85,
				attribution: 'Sentinel Hub',
				crs: leaflet.CRS.EPSG4326
			}
		);

		const baseMaps = {
			IGN: ign,
			OSM: osm,
			'Sentinel 2': wmsSentinel2
		};

		const overlayMaps = {
			'Suelos ITACyL': wms
		};

		leaflet.control.layers(baseMaps, overlayMaps).addTo(map);

		// ------- This is needed for the clustering of polygons
		leaflet.Polygon.addInitHook(function () {
			this._latlng = this.getBounds().getCenter();
		});

		leaflet.Polygon.include({
			getLatLng: function () {
				return this._latlng;
			},
			setLatLng: function () {}
		});
		// -------

		leaflet.control
			.custom({
				position: 'topright',
				content:
					'<button type="button" class="leaflet-center">' +
					'    <i class="fi fi-rr-trash-undo-alt"></i>' +
					'</button>',
				events: {
					click: function () {
						mapStore.set({
							flyToCoords: $mapStore.flyToCoords,
							selectedEnclosure: undefined
						});
					}
				}
			})
			.addTo(map);

		leaflet.control
			.custom({
				position: 'topright',
				content:
					'<button type="button" class="leaflet-center">' +
					'    <i class="fi fi-rr-home-location"></i>' +
					'</button>',
				events: {
					click: function () {
						// map.fitBounds(markers.getBounds());
					}
				}
			})
			.addTo(map);

		leaflet.control
			.custom({
				position: 'bottomright',
				content: `<div class="button radius-input"><label>Radio</label><input type="range" min="100" max="1000" value="${distance}" class="slider" step="100"></div>`,
				style: {
					margin: '10px',
					padding: '0px'
				},
				events: {
					input: function (data) {
						distance = Number(data.target.value);
					}
				}
			})
			.addTo(map);
	});

	onDestroy(async () => {
		map.remove();
	});

	const tooltipContent = (activity) => {
		return (
			'<strong>' +
			activity.activity +
			' (' +
			formattedTime(activity.date) +
			')</strong>' +
			'<br>Plaga: ' +
			activity.properties?.plague.name +
			'<br>Fito: ' +
			activity.properties?.phytosanitary.name +
			'<br>Dosis: ' +
			numberWithCommas(activity.properties?.quantity) +
			activity.properties?.doseUnit +
			'<br>Agente: ' +
			activity.properties?.healthAgent.name
		);
	};
</script>

<div class="card" bind:this={mapElement} />

<style lang="scss">
	.card {
		height: 100%;
		padding: 0;
	}

	:global(.radius-input) {
		display: flex;
		flex-direction: column;
		align-items: start !important;
	}

	.leaflet-center {
		padding: 0 !important;
	}
</style>
