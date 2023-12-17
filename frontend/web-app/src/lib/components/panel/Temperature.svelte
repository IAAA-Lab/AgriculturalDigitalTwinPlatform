<script lang="ts">
	import type { Prediction } from '$lib/core/Domain';

	import Chart from './Chart.svelte';

	export let pred: Prediction;
</script>

<div class="card">
	<div class="header">
		<i class="fi fi-rr-temperature-high" />
		<p class="m-0">Temperatura</p>
	</div>
	<div class="chart">
		<Chart
			data={{
				data: {
					datasets: [
						{
							type: 'line',
							data: pred?.ta.map((t) => ({
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
								const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
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
							max: 40,
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
			<strong>Min: {Math.min(...pred?.ta?.map((ta) => ta.value))} °C</strong>
		</p>
		<p class="m-0">
			<strong>Max: {Math.max(...pred?.ta?.map((ta) => ta.value))} °C</strong>
		</p>
	</div>
</div>

<style lang="scss">
	.card {
		grid-area: temperature;
		display: flex;
		flex-direction: column;
		justify-self: end;
		width: 70%;

		.chart {
			flex: 1;
			height: 65%;
		}
	}

	.temp__min__max {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}
</style>
