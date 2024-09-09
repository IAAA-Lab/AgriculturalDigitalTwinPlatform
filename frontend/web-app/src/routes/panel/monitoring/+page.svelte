<script lang="ts">
	import { page } from '$app/stores';
	import Error from '$lib/components/misc/Error.svelte';
	import Loading from '$lib/components/misc/Loading.svelte';
	import AnalysisYearCompChart from '$lib/components/panel/AnalysisYearCompChart.svelte';
	import CharacteristicsEnclosure from '$lib/components/panel/CharacteristicsEnclosure.svelte';
	import CropStats from '$lib/components/panel/CropStats.svelte';
	import CurrentWeather from '$lib/components/panel/CurrentWeather.svelte';
	import DailyWeather from '$lib/components/panel/DailyWeather.svelte';
	import FileUpload from '$lib/components/panel/FileUpload.svelte';
	import ForecastWeather from '$lib/components/panel/ForecastWeather.svelte';
	import MapInd from '$lib/components/panel/MapInd.svelte';
	import RealTimeSensors from '$lib/components/panel/RealTimeSensors.svelte';
	import Temperature from '$lib/components/panel/Temperature.svelte';
	import Uv from '$lib/components/panel/UV.svelte';
	import Wind from '$lib/components/panel/Wind.svelte';
	import { IMAGES_SERVER_URL, digitalTwinsService } from '$lib/config/config';
	import { userEnclosures } from '$lib/config/stores/enclosures';
	import type { DigitalTwin } from '$lib/core/Domain';
	import { onCropImageError } from '$lib/core/functions';
	import Notifications from '../../../lib/components/panel/Notifications.svelte';

	let digitalTwinId: string | undefined =
		$page.url.searchParams.get('digitalTwinId') || $userEnclosures.at(0)?.id;
	let digitalTwin: DigitalTwin | undefined = undefined;
	let currentWeather: any = undefined;
	let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
	let selectedDate: string | undefined = new Date(new Date().setDate(new Date().getDate() - 3))
		.toISOString()
		.split('T')[0];

	$: digitalTwin = $userEnclosures.find((e) => e.id === digitalTwinId);

	$: {
		if (digitalTwin) {
			currentWeather = undefined;
			digitalTwinsService
				.getDailyWeather(digitalTwin.id)
				.then((cw) => {
					currentWeather = cw;
				})
				.catch((err) => {
					currentWeather = null;
				});
		}
	}
</script>

{#if !digitalTwin}
	<h1>Enclosure not found</h1>
{:else}
	<div class="header mb-8">
		<img
			src={`${IMAGES_SERVER_URL}/${digitalTwin?.properties?.crop?.id}.png`}
			alt="Análisis"
			height="40px"
			on:error={onCropImageError}
		/>
		<h3>{digitalTwin.properties.crop.name || 'Cultivo desconocido'}</h3>
		<select bind:value={digitalTwinId}>
			{#each $userEnclosures as digitalTwin}
				<option value={digitalTwin.id}>{digitalTwin.id}</option>
			{/each}
		</select>
	</div>
	<section class="container">
		<CropStats digitalTwinId={digitalTwinId || ''} />
		<div class="map" style="grid-area: map; margin: 0 1rem 1rem 0;">
			<MapInd {digitalTwin} endDate={selectedDate} />
		</div>
		<div class="card ndvi" style="grid-area: ndvi;">
			<AnalysisYearCompChart
				bind:selectedDate
				digitalTwins={[digitalTwin.id]}
				endDate={new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0]}
				startDate={new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]}
				idema={digitalTwin?.properties?.meteoStation?.idema}
			/>
		</div>
		<div style="grid-area: sensor-stream">
			<RealTimeSensors digitalTwinId={digitalTwinId || ''} />
		</div>
		<CharacteristicsEnclosure properties={digitalTwin.properties} />
		{#if currentWeather === null}
			<Error errorMessage="No hay datos disponibles" />
		{:else if !currentWeather}
			<Loading />
		{:else if currentWeather.prediction}
			<CurrentWeather cw={currentWeather} />
			<DailyWeather
				ta={currentWeather?.prediction?.at(0)?.ta}
				skyState={currentWeather?.prediction?.at(0)?.skyState}
			/>
			{#await digitalTwinsService.getHistoricalWeather(digitalTwin?.id || '', startDate, new Date())}
				<Loading />
			{:then hw}
				<div style="grid-area: uv; display: flex; flex-direction:row; column-gap: 0.5rem">
					<Uv />
					<Wind pred={currentWeather?.prediction?.at(0)} />
				</div>
				<Temperature pred={currentWeather?.prediction?.at(0)} />
			{:catch err}
				<Error errorMessage="No hay datos meteorológicos disponibles" />
			{/await}
			<ForecastWeather digitalTwinId={digitalTwin.id} />
		{:else}
			<Error errorMessage="No hay datos meteorológicos disponibles" />
		{/if}
	</section>
	<br />
	<hr style="width: 80%; color: black; margin: 0.5rem 0;" />
	<div class="header mb-8">
		<h1>Volcado de datos</h1>
	</div>
	<div style="display: flex; flex-direction: row; flex-wrap: wrap; gap: 1rem;">
		<FileUpload title="Actividades" url="/enclosures/{digitalTwinId}/files/activities" />
		<FileUpload title="Fitosanitarios" url="/enclosures/{digitalTwinId}/files/phytosanitary" />
		<FileUpload title="Producción y cosecha" url="/enclosures/{digitalTwinId}/files/yield" />
	</div>
	<br />
{/if}

<style lang="scss">
	section {
		display: grid;
		gap: 0.5rem;
		grid-template-columns: 300px 1fr 1.3fr;
		grid-template-rows: auto 480px auto auto 250px 150px;
		grid-template-areas:
			'crop-stats crop-stats crop-stats'
			'characteristics map ndvi'
			'sensor-stream sensor-stream sensor-stream'
			'daily-weather daily-weather daily-weather'
			'current-weather forecast-weather temperature'
			'current-weather uv temperature';
	}

	.header {
		display: flex;
		flex-wrap: wrap;
		column-gap: 0.5rem;
		align-items: center;
	}

	@include media('<medium') {
		section {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;

			.map,
			.ndvi {
				height: 325px;
			}

			&:first-child {
				margin-top: 3rem;
			}
		}
	}
</style>
