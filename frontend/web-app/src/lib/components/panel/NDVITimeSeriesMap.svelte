<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import axios from 'axios';

	let ndviImages: any[] = [];
	export let geojsonCoordinates: any;

	// Set your Sentinel Hub instance ID and API key
	const instanceId = '981976b3-d724-45bb-856b-08d4d9c99848';

	// Define the time range for the time series
	const startDate = '2022-09-01';
	const endDate = '2022-11-31';

	let controller = new AbortController();

	$: (async () => {
		ndviImages = [];
		controller.abort();
		controller = new AbortController();
		// Make multiple requests to get NDVI images for different time periods
		for (let date = startDate; date <= endDate; date = getNextDay(date)) {
			const imageUrl = await getNDVIImageURL(instanceId, geojsonCoordinates, date);
			// Sleep for 1 second to avoid exceeding the Sentinel Hub rate limit
			await new Promise((resolve) => setTimeout(resolve, 1000));
			if (imageUrl) ndviImages = [...ndviImages, { date, imageUrl }];
		}
	})();

	// Function to get the next day's date
	function getNextDay(date) {
		const current = new Date(date);
		current.setDate(current.getDate() + 1);
		return current.toISOString().split('T')[0];
	}

	// Function to get the NDVI image URL for a specific date
	async function getNDVIImageURL(instanceId, geojsonCoordinates, date) {
		const url = `https://services.sentinel-hub.com/ogc/wms/${instanceId}?request=GetMap&layers=NDVI&format=image/png&transparent=true&time=${date}/${date}&bbox=${getBoundingBox(
			geojsonCoordinates
		)}&width=512&height=512&crs=EPSG:4326`;
		const response = await axios.get(url, { signal: controller.signal });
		// Check if image is not empty (more than 10 Kb)
		if (response.data.length > 10000) return response.config.url;

		return null;
	}

	// Function to calculate the bounding box for the geojson coordinates
	function getBoundingBox(geojsonCoordinates) {
		const coordinates = geojsonCoordinates.coordinates[0];
		const latitudes = coordinates.map((coordinate) => coordinate[1]);
		const longitudes = coordinates.map((coordinate) => coordinate[0]);
		const minLat = Math.min(...latitudes);
		const maxLat = Math.max(...latitudes);
		const minLon = Math.min(...longitudes);
		const maxLon = Math.max(...longitudes);
		return `${minLon},${minLat},${maxLon},${maxLat}`;
	}

	onDestroy(() => {
		controller.abort();
	});
</script>

<h1>NDVI Time Series</h1>
{#each ndviImages as { date, imageUrl }}
	<div>
		<p>{date}</p>
		<img src={imageUrl} />
	</div>
{/each}

<style>
	/* Add your styles here */
</style>
