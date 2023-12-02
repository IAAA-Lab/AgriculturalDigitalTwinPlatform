<script lang="ts">
	import CharacteristicsEnclosure from '$lib/components/panel/CharacteristicsEnclosure.svelte';
	import CurrentWeather from '$lib/components/panel/CurrentWeather.svelte';
	import { userEnclosures } from '$lib/config/stores/enclosures';
	import type { Enclosure } from '$lib/core/Domain';
	import { IMAGES_SERVER_URL, enclosuresService } from '$lib/config/config';
	import Loading from '$lib/components/misc/Loading.svelte';
	import Treatments from '$lib/components/panel/Treatments.svelte';
	import CropStats from '$lib/components/panel/CropStats.svelte';
	import WeatherStats from '$lib/components/panel/WeatherStats.svelte';
	import ForecastWeather from '$lib/components/panel/ForecastWeather.svelte';
	import DailyWeather from '$lib/components/panel/DailyWeather.svelte';
	import Error from '$lib/components/misc/Error.svelte';
	import { page } from '$app/stores';
	import AnalysisYearCompChart from '$lib/components/panel/AnalysisYearCompChart.svelte';
	import { onCropImageError } from '$lib/core/functions';

	let enclosureId: string | undefined =
		$page.url.searchParams.get('enclosureId') || $userEnclosures.at(0)?.id;
	let enclosure: Enclosure | undefined = undefined;
	let currentWeather: any = undefined;

	$: enclosure = $userEnclosures.find((e) => e.id === enclosureId);

	$: {
		if (enclosure) {
			enclosuresService
				.getDailyWeather(enclosure.id)
				.then((cw) => {
					currentWeather = cw;
				})
				.catch((err) => {
					currentWeather = null;
				});
		}
	}
</script>

<select bind:value={enclosureId}>
	{#each $userEnclosures as enclosure}
		<option value={enclosure.id}>{enclosure.id}</option>
	{/each}
</select>

{#if !enclosure}
	<h1>Enclosure not found</h1>
{:else}
	<div class="header mb-8">
		<img
			src={`${IMAGES_SERVER_URL}/${enclosure?.properties?.cropId}.png`}
			alt="Análisis"
			height="40px"
			on:error={onCropImageError}
		/>
		<h3>{enclosure.properties.cropName}</h3>
		<h1>{enclosure.id}</h1>
	</div>
	<section class="container-responsive">
		<CropStats enclosureId={enclosure.id} />
		<CharacteristicsEnclosure properties={enclosure.properties} />
		<div class="card">
			<AnalysisYearCompChart
				enclosures={[enclosureId || '']}
				limit={30}
				startDate={new Date(new Date().setDate(new Date().getDate() - 30))
					.toISOString()
					.split('T')[0]}
				idema={enclosure?.meteoStation.idema}
			/>
		</div>
		<Treatments enclosureId={enclosure.id} />
		{#if currentWeather === null}
			<Error errorMessage="No hay datos disponibles" />
		{:else if !currentWeather}
			<Loading />
		{:else}
			<CurrentWeather cw={currentWeather} />
			<DailyWeather
				ta={currentWeather?.prediction?.at(0).ta}
				skyState={currentWeather?.prediction?.at(0).skyState}
			/>
			<WeatherStats pred={currentWeather?.prediction.at(0)} idema={enclosure.meteoStation.idema} />
			<ForecastWeather enclosureId={enclosure.id} />
		{/if}
	</section>
{/if}

<style>
	section {
		display: grid;
		gap: 0.5rem;
		grid-template-columns: 300px 1fr auto;
		grid-template-areas:
			'crop-stats crop-stats crop-stats'
			'characteristics ndvi current-weather'
			'treatments treatments treatments'
			'daily-weather daily-weather daily-weather'
			'forecast-weather weather-stats weather-stats';
	}

	.card {
		grid-area: ndvi;
	}

	.header {
		display: flex;
		flex-wrap: wrap;
		column-gap: 0.5rem;
		align-items: center;
	}
</style>
