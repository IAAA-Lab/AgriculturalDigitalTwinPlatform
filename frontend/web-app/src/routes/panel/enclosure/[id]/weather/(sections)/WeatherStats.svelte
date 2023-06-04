<script lang="ts">
	import Loading from '$lib/components/misc/Loading.svelte';
	import Chart from '$lib/components/panel/Chart.svelte';
	import WeatherCard from '$lib/components/panel/WeatherCard.svelte';
	import { enclosuresService } from '$lib/config/config';

	const startDate = new Date();
	startDate.setDate(startDate.getDate() - 14);
	let currentHour = new Date().getHours();

	export let pred: any;
</script>

<section>
	<div>
		<WeatherCard class="child">
			<div slot="header" class="header">
				<i class="fi fi-rr-cloud-showers-heavy" />
				<p class="m-0">Precipitaciones (Últimos 7 días)</p>
			</div>
			<div slot="body" class="body" style="max-height: 300px; min-height: 100px;">
				{#await enclosuresService.getHistoricalWeather('9434', startDate, new Date())}
					<Loading />
				{:then hw}
					<Chart
						data={{
							type: 'bar',
							data: {
								datasets: [
									{
										label: '',
										data: hw?.map((h) => h?.prec),
										fill: false,
										borderColor: '#2F3030',
										tension: 0.3,
										maxBarThickness: 40,
										borderWidth: 2
									}
								],
								labels: hw?.map((h) => h?.date?.split('T')[0])
							},
							options: {
								elements: {
									bar: {
										borderRadius: 6,
										borderWidth: 0,
										backgroundColor: function (context) {
											const chart = context.chart;
											const { ctx, chartArea } = chart;
											if (!chartArea) {
												// This case happens on initial chart load
												return null;
											}
											const gradient = ctx.createLinearGradient(
												0,
												chartArea.bottom,
												0,
												chartArea.top
											);
											gradient.addColorStop(0, '#3fc7f5a0');
											gradient.addColorStop(0.5, '#2140f5a0');
											return gradient;
										}
									}
								},
								responsive: true,
								maintainAspectRatio: false,
								plugins: {
									legend: {
										display: false
									},
									title: {
										display: true,
										text: 'Dosis aplicada por fecha',
										font: {
											size: 16,
											weight: 'bold'
										}
									}
								},
								scales: {
									x: {
										grid: {
											drawBorder: false,
											display: false
										}
									},
									y: {
										grid: {
											drawBorder: false
										},
										title: {
											display: true,
											text: 'Precipitación (mm)',
											font: {
												size: 14,
												weight: 'bold'
											}
										}
									}
								}
							}
						}}
					/>
				{:catch error}
					<p>Error: {error.message}</p>
				{/await}
			</div>
		</WeatherCard>
		<WeatherCard class="child">
			<div slot="header" class="header">
				<i class="fi fi-rr-wind" />
				<p class="m-0">Viento</p>
			</div>
			<div slot="body" class="body">
				<img src="$lib/assets/compass.svg" alt="wind direction" height="100" width="100" />
				<p class="text-m m-0">
					<strong
						>{pred?.wind?.find((w) => w.period == currentHour)?.speed?.at(0) || '--'}
						km/h</strong
					>
				</p>
			</div>
		</WeatherCard>
		<WeatherCard class="child">
			<div slot="header" class="header">
				<i class="fi fi-rr-sun" />
				<p class="m-0">UV</p>
			</div>
			<div slot="body" class="body">
				<br />
				<input type="range" class="slider" min="0" max="10" value="1" />
				<p class="text-m m-0"><strong>1</strong></p>
			</div>
		</WeatherCard>
		<WeatherCard class="child">
			<div slot="header" class="header">
				<i class="fi fi-rr-temperature-high" />
				<p class="m-0">Temperatura</p>
			</div>
			<div slot="body" class="body">
				<div style="max-height: 250px; min-height: 150px; width: 100%;">
					<Chart
						data={{
							data: {
								datasets: [
									{
										type: 'line',
										data: pred.ta.map((t) => ({
											x: t.period,
											y: t.value
										})),
										fill: true,
										backgroundColor: function (context) {
											const chart = context.chart;
											const { ctx, chartArea } = chart;
											if (!chartArea) {
												return null;
											}
											const gradient = ctx.createLinearGradient(
												0,
												chartArea.bottom,
												0,
												chartArea.top
											);
											gradient.addColorStop(0, '#267DF3');
											gradient.addColorStop(0.6, '#F34A26');
											return gradient;
										},
										borderWidth: 3,
										borderColor: '#2F3030',
										tension: 0.2
									}
								]
							},
							options: {
								responsive: true,
								maintainAspectRatio: false,
								plugins: {
									legend: {
										display: false
									},
									title: {
										display: false
									}
								},
								scales: {
									x: {
										grid: {
											drawBorder: false,
											display: false
										}
									},
									y: {
										max: 60,
										grid: {
											drawBorder: false
										}
									}
								}
							}
						}}
					/>
				</div>
				<div class="temp__min__max">
					<p class="m-0">
						<strong>Min: {Math.min(...pred.ta.map((ta) => ta.value))} °C</strong>
					</p>
					<p class="m-0">
						<strong>Max: {Math.max(...pred.ta.map((ta) => ta.value))} °C</strong>
					</p>
				</div>
			</div>
		</WeatherCard>
	</div>
</section>

<style lang="scss">
	section {
		grid-area: weather-stats;
	}

	section > div {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.header {
		display: flex;
		flex-direction: row;
		column-gap: 0.75rem;

		p {
			color: rgb(78, 78, 78);
		}
	}

	.temp__min__max {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		column-gap: 1rem;
	}

	.body {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		row-gap: 0.5rem;
	}

	:global(.child:first-child) {
		width: 100%;
	}

	:global(.child:not(:first-child)) {
		flex: 1 0 auto;
		min-width: 150px;
	}

	:global(.child:last-child) {
		flex: auto;
		width: 100%;
	}

	.slider {
		-webkit-appearance: none;
		height: 15px;
		border-radius: 5px;
		background: linear-gradient(
			90deg,
			rgba(255, 0, 0, 1) 0%,
			rgba(255, 154, 0, 1) 10%,
			rgba(208, 222, 33, 1) 20%,
			rgba(79, 220, 74, 1) 30%,
			rgba(63, 218, 216, 1) 40%,
			rgba(47, 201, 226, 1) 50%,
			rgba(28, 127, 238, 1) 60%,
			rgba(95, 21, 242, 1) 70%,
			rgba(186, 12, 248, 1) 80%,
			rgba(251, 7, 217, 1) 90%,
			rgba(255, 0, 0, 1) 100%
		);
		outline: none;
		width: 100%;
	}
</style>
