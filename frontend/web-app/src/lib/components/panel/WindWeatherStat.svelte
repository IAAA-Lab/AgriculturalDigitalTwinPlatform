<script>
	import WeatherStat from './WeatherStat.svelte';
	export let windSpeed = '--';
</script>

<div class="wind">
	<WeatherStat title="Viento">
		<i slot="header-icon" class="fi fi-rr-wind pt-4" />
		<div slot="body" class="body">
			<img src="$lib/assets/compass.svg" alt="compass" width="100%" height="100%" />
			<p class="text-sm m-0 mt-16"><strong>{windSpeed} km/h</strong></p>
		</div>
	</WeatherStat>
</div>

<style>
	.body {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}

	.wind {
		grid-area: wind;
	}
</style>
