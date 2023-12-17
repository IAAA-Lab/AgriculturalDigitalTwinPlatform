<script lang="ts">
	import Error from '$lib/components/misc/Error.svelte';
	import Loading from '$lib/components/misc/Loading.svelte';
	import { enclosuresService } from '$lib/config/config';
	import { getWeatherIcon } from '$lib/core/functions';
	import ForecastWeatherItem from './ForecastWeatherItem.svelte';

	export let enclosureId: String;
	let aux = enclosureId.split('-');
	aux.pop();
	const parcelId = aux.join('-');
</script>

<section class="card">
	<h3 class="m-0 mb-8">Previsión (7 días)</h3>
	{#await enclosuresService.getForecastWeather(parcelId)}
		<Loading />
	{:then forecast}
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
	{:catch error}
		<div>{error.message}</div>
		<Error />
	{/await}
</section>

<style>
	section {
		grid-area: forecast-weather;
		overflow: hidden;
		min-width: 500px;
		max-width: 600px;
		max-height: 230px;
	}

	.divider {
		height: 1px;
		background-color: rgb(195, 195, 195);
	}
</style>
