<script lang="ts">
	import CurrentWeatherFooter from '$lib/components/panel/CurrentWeatherFooter.svelte';
	import CurrentWeatherHeader from '$lib/components/panel/CurrentWeatherHeader.svelte';
	import WeatherCard from '$lib/components/panel/WeatherCard.svelte';
	import { getWeatherIcon } from '$lib/core/functions';

	export let cw: any;
	const pred = cw.prediction[0];
	let currentHour = new Date().getHours();
</script>

<section>
	<WeatherCard class="current__wc">
		<svelte:fragment slot="body">
			<CurrentWeatherHeader
				date={cw.elaboratedAt}
				address={cw.municipality + ', ' + cw.province}
				ta={pred.ta?.find((t) => t.period == currentHour)?.value}
				skyState={pred.skyState?.find((t) => t.period == currentHour)?.description}
			>
				<svelte:fragment slot="icon">
					{@html getWeatherIcon(pred.skyState?.find((t) => t.period == currentHour)?.description)}
				</svelte:fragment>
			</CurrentWeatherHeader>
			<br />
			<CurrentWeatherFooter
				producer={cw.origin?.producer}
				web={cw.origin?.web}
				copyright={cw.origin?.copyright}
				legalNote={cw.origin?.legalNote}
			/>
		</svelte:fragment>
	</WeatherCard>
</section>

<style lang="scss">
	section {
		grid-area: current-weather;
		display: flex;
		justify-content: center;
		align-items: flex-start;

		:global(.current__wc) {
			max-width: 300px;
		}
	}
</style>
