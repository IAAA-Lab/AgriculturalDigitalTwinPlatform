<script lang="ts">
	import Error from '$lib/components/misc/Error.svelte';
	import Loading from '$lib/components/misc/Loading.svelte';
	import CardInner from '$lib/components/panel/CardInner.svelte';
	import WeatherCard from '$lib/components/panel/WeatherCard.svelte';
	import { enclosuresService } from '$lib/config/config';
	import { getWeatherIcon } from '$lib/core/functions';
	import ForecastWeatherItem from '../(components)/ForecastWeatherItem.svelte';

	export let enclosureId: String;
	let aux = enclosureId.split('-');
	aux.pop();
	const parcelId = aux.join('-');
</script>

<section>
	<WeatherCard>
		<h3 class="m-0 mb-8" slot="header">Previsión (7 días)</h3>
		<div slot="body" style="overflow: hidden;">
			{#await enclosuresService.getForecastWeather(parcelId)}
				<Loading />
			{:then forecast}
				<CardInner>
					<div slot="body" class="p-8 body">
						{#each forecast.prediction.day as f, i}
							<ForecastWeatherItem day={f.date} minTa={f.ta.tamin} maxTa={f.ta.tamax}>
								<svelte:fragment slot="icon">
									{@html getWeatherIcon(f.skyState[0].description || '')}
								</svelte:fragment>
							</ForecastWeatherItem>
							{#if i < forecast.prediction.day.length - 1}
								<div class="divider" />
							{/if}
						{/each}
					</div>
				</CardInner>
			{:catch error}
				<div>{error.message}</div>
				<Error />
			{/await}
		</div>
	</WeatherCard>
</section>

<style>
	section {
		grid-area: forecast-weather;
		overflow: hidden;
		min-width: 200px;
	}

	.body {
		display: flex;
		flex-direction: column;
		row-gap: 0.1rem;
		overflow-x: scroll;
	}

	.divider {
		width: 100%;
		height: 1px;
		background-color: rgb(195, 195, 195);
	}
</style>
