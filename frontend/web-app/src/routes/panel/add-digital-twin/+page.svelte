<script lang="ts">
	import { goto } from '$app/navigation';
	import MapInd from '$lib/components/panel/MapInd.svelte';
	import { digitalTwinsService } from '$lib/config/config';
	import { user } from '$lib/config/stores/user';

	const createNewDigitalTwin = async (e: Event) => {
		e.preventDefault();
		// Get user information
		const { id } = $user;
		try {
			// Add id to digital twin
			let parsedDigitalTwin = JSON.parse(digitalTwin);
			parsedDigitalTwin.properties.userId = id;
			await digitalTwinsService.createNewDigitalTwin(parsedDigitalTwin);
			// Refresh page
			goto('/panel');
		} catch (error) {
			alert('Error al crear el gemelo digital');
		}
	};

	let digitalTwin = `{
  "crs": {
      "type": "EPSG",
      "properties": {
        "code": "4258"
      }
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [-4.81864831, 41.26837826],
          [-4.81907464, 41.26881161],
          [-4.8199982, 41.26978049],
          [-4.81846365, 41.27170914],
          [-4.81840387, 41.27168037],
          [-4.8183445, 41.27164446],
          [-4.82010139, 41.26994075],
          [-4.81802234, 41.26865898],
          [-4.81864831, 41.26837826]
        ]
      ]
    },
    "properties": {
      "location": {
        "province": "VALLADOLID",
        "city": "MORALEJA DE LAS PANADERAS",
        "municipality": "MORALEJA DE LAS PANADERAS",
        "geographicSpot": "MORALEJA DE LAS PANADERAS",
        "ccaa": "CASTILLA Y LEON"
      },
      "crop": {
        "id": "100",
        "name": "PISTACHO",
        "varietyId": "",
        "variety": "KERMAN"
      },
      "slope": 0,
      "area": 13.63,
      "areaSIGPAC": 13.63,
      "parcelUse": "FS",
      "irrigationCoef": 96,
      "admisibility": 0,
      "rainfedOrIrrigated": "Irrigated"
    },
    "type": "Feature",
    "id": "47-96-0-0-5-20-1",
    "year": 2022
}`;

	let formatedGeojson = '';

	$: {
		try {
			formatedGeojson = JSON.parse(digitalTwin);
		} catch (error) {
			formatedGeojson = '';
		}
	}
</script>

<h1>Crear nuevo gemelo digital</h1>
<p>Introduce el GeoJSON asociado a la parcela para crear un nuevo gemelo digital</p>
<section>
	<form on:submit|preventDefault={createNewDigitalTwin}>
		<label for="geojson">Introduce el GeoJSON asociado a la parcela</label>
		<!-- Restrict manual size adjust -->
		<textarea id="geojson" name="geojson" rows="30" cols="50" bind:value={digitalTwin}></textarea>
		<button type="submit">Crear</button>
		<!-- {digitalTwin} -->
	</form>
	<div style="height: 670px; max-width: 500px; width: 500px;">
		{#if digitalTwin}
			<MapInd digitalTwin={formatedGeojson} />
		{:else}
			<p>Introduce el GeoJSON asociado a la parcela para crear un nuevo gemelo digital</p>
		{/if}
	</div>
</section>

<style lang="scss">
	h1 {
		margin-top: 0;
	}

	section {
		display: flex;
		flex-direction: row;
		justify-content: center;
		height: 100%;
		flex-wrap: wrap;
		gap: 1rem;
		padding-top: 2rem;
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
