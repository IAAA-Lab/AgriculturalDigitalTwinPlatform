<script lang="ts">
	import { page } from '$app/stores';
	import Error from '$lib/components/misc/Error.svelte';
	import Loading from '$lib/components/misc/Loading.svelte';
	import CharacteristicsEnclosure from '$lib/components/panel/CharacteristicsEnclosure.svelte';
	import CropStats from '$lib/components/panel/CropStats.svelte';
	import CurrentWeather from '$lib/components/panel/CurrentWeather.svelte';
	import DailyWeather from '$lib/components/panel/DailyWeather.svelte';
	import ForecastWeather from '$lib/components/panel/ForecastWeather.svelte';
	import NdviTimeSeries from '$lib/components/panel/NDVITimeSeries.svelte';
	import Precipitations from '$lib/components/panel/Precipitations.svelte';
	import Temperature from '$lib/components/panel/Temperature.svelte';
	import Uv from '$lib/components/panel/UV.svelte';
	import Wind from '$lib/components/panel/Wind.svelte';
	import { IMAGES_SERVER_URL, enclosuresService } from '$lib/config/config';
	import { userEnclosures } from '$lib/config/stores/enclosures';
	import type { Enclosure } from '$lib/core/Domain';
	import { onCropImageError } from '$lib/core/functions';

	let enclosureId: string | undefined =
		$page.url.searchParams.get('enclosureId') || $userEnclosures.at(0)?.id;
	let enclosure: Enclosure | undefined = undefined;
	let currentWeather: any = undefined;
	let startDate = new Date(new Date().setDate(new Date().getDate() - 30));

	$: enclosure = $userEnclosures.find((e) => e.id === enclosureId);

	$: {
		if (enclosure) {
			currentWeather = undefined;
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
		<h3>{enclosure.properties.cropName || 'Cultivo desconocido'}</h3>
		<select bind:value={enclosureId}>
			{#each $userEnclosures as enclosure}
				<option value={enclosure.id}>{enclosure.id}</option>
			{/each}
		</select>
	</div>
	<section class="container">
		<CropStats enclosureId={enclosureId || ''} />
		<NdviTimeSeries {enclosure} />
		<CharacteristicsEnclosure properties={enclosure.properties} />
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
			{#await enclosuresService.getHistoricalWeather(enclosure.meteoStation.idema || '', startDate, new Date())}
				<Loading />
			{:then hw}
				<Precipitations {hw} />
				<Wind pred={currentWeather?.prediction?.at(0)} />
				<Uv />
				<Temperature pred={currentWeather?.prediction?.at(0)} />
			{:catch err}
				<Error errorMessage="No hay datos meteorológicos disponibles" />
			{/await}
			<ForecastWeather enclosureId={enclosure.id} />
		{:else}
			<Error errorMessage="No hay datos meteorológicos disponibles" />
		{/if}
	</section>
	<br />
{/if}

<style lang="scss">
	section {
		display: grid;
		gap: 0.5rem;
		grid-template-columns: 300px auto 1fr;
		grid-template-rows: auto 480px auto 380px 170px 100px;
		grid-template-areas:
			'crop-stats crop-stats crop-stats' 'characteristics ndvi ndvi'
			'daily-weather daily-weather daily-weather'
			'current-weather forecast-weather precipitations'
			'wind temperature temperature'
			'uv temperature temperature';
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

	@include media('<medium') {
		section {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;

			&:first-child {
				margin-top: 3rem;
			}
		}
	}
</style>
