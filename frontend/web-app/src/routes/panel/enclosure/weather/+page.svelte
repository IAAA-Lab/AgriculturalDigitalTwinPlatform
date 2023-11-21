<script lang="ts">
	import WeatherStats from './(sections)/WeatherStats.svelte';
	import CurrentWeather from './(sections)/CurrentWeather.svelte';
	import DailyWeather from './(sections)/DailyWeather.svelte';

	import { page } from '$app/stores';
	import Loading from '$lib/components/misc/Loading.svelte';
	import { enclosuresService } from '$lib/config/config';
	import Error from '$lib/components/misc/Error.svelte';
	import ForecastWeather from './(sections)/ForecastWeather.svelte';
	import { userEnclosures } from '$lib/config/stores/enclosures';

	let id: string = $page.data.id;
	let enclosure = $userEnclosures.find((e) => e.id === $page.data.id);
</script>

<div class="container">
	<h1 class="title pb-16">Recinto#{id} · Tiempo</h1>
	<div class="inner__container">
		{#await enclosuresService.getDailyWeather(id)}
			<Loading />
		{:then cw}
			{@const pred = cw.prediction[0]}
			<CurrentWeather {cw} />
			<DailyWeather ta={pred.ta} skyState={pred.skyState} />
			<WeatherStats {pred} idema={enclosure?.meteoStation.idema} />
		{:catch error}
			<Error errorMessage={error.message} />
		{/await}
		<ForecastWeather enclosureId={id} />
	</div>
</div>

<style lang="scss">
	.inner__container {
		display: grid;
		grid-template-columns: 2fr 2fr 1fr;
		grid-template-areas:
			'daily-weather daily-weather current-weather'
			'weather-stats forecast-weather current-weather'
			'weather-stats temp-map temp-map';
		gap: 1rem;
	}

	@include media('<large') {
		.inner__container {
			grid-template-columns: 1fr;
			grid-template-areas:
				'current-weather'
				'daily-weather'
				'weather-stats'
				'forecast-weather'
				'temp-map';
		}
	}
</style>
