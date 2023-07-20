<script lang="ts">
	import { enclosuresService } from '$lib/config/config';
	import type { NDVI, HistoricalWeather } from '$lib/core/Domain';
	import { getRangeBarColor, numberWithCommas } from '$lib/core/functions';
	import 'chartjs-adapter-date-fns';
	import { es } from 'date-fns/locale';
	import Range from '../misc/Range.svelte';
	import Chart from './Chart.svelte';

	export let enclosureId: string;
	export let idema: string;

	let ndviValues: NDVI | null = null;
	let weatherValues: HistoricalWeather[] = [];
	let startDate: string = new Date(new Date().setDate(new Date().getDate() - 90))
		.toISOString()
		.split('T')[0];
	let endDate: string = new Date().toISOString().split('T')[0];
	let LIMIT: number | undefined = 30;
	let ndviAvg: number = 0;

	$: {
		if (startDate && endDate) {
			LIMIT = undefined;
		}
	}

	$: {
		enclosuresService
			.getNDVI([enclosureId], new Date(startDate), new Date(endDate), LIMIT)
			.then((ndvi) => {
				ndviValues = ndvi[0];
				ndviAvg = ndvi[0].ndvi.reduce((a, b) => a + b?.value, 0) / ndvi[0].ndvi.length;
				enclosuresService
					.getHistoricalWeather(
						idema,
						new Date(ndvi[0].ndvi.at(-1)?.date || startDate),
						new Date(ndvi[0].ndvi.at(0)?.date || endDate),
						['date', 'prec']
					)
					.then((weather) => {
						weatherValues = weather;
					})
					.catch((error) => {
						weatherValues = [];
					});
			})
			.catch((error) => {
				ndviValues = null;
				ndviAvg = 0;
			});
	}
</script>

<div class="card">
	<h4 class="m-0">Media</h4>
	<div class="p-8 body">
		<div class="date__picker">
			<input type="date" bind:value={startDate} />
			<input type="date" bind:value={endDate} />
			<div class="card-inner ndvi__card range__bar">
				<Range value={ndviAvg} to={1} background={getRangeBarColor(ndviAvg)} />
				<h3 class="m-0">
					<strong>{numberWithCommas(ndviAvg)}<strong /></strong>
				</h3>
			</div>
		</div>
		<div class="card-inner card__wrapper">
			<div class="chart__wrapper">
				<Chart
					data={{
						data: {
							datasets: [
								{
									type: 'line',
									data: ndviValues?.ndvi.map((ndvi) => ({
										x: new Date(ndvi.date),
										y: ndvi.value
									})),
									label: 'ndvi',
									fill: true,
									borderColor: '#800791',
									backgroundColor: 'transparent',
									tension: 0.2,
									yAxisID: 'y1'
								},
								{
									type: 'bar',
									data: weatherValues?.map((weather) => ({
										x: new Date(weather.date),
										y: weather.prec
									})),
									label: 'lluvias',
									fill: true,
									borderColor: '#076F91',
									backgroundColor: '#076F91',
									tension: 0.2,
									yAxisID: 'y'
								}
							]
						},
						options: {
							responsive: true,
							maintainAspectRatio: false,
							scales: {
								y: {
									type: 'linear',
									display: true,
									position: 'left',
									title: {
										display: true,
										text: 'Lluvias (mm)'
									}
								},
								y1: {
									type: 'linear',
									display: true,
									position: 'right',
									title: {
										display: true,
										text: 'NDVI'
									},
									max: 1,
									grid: {
										drawOnChartArea: false
									}
								},
								x: {
									display: true,
									position: 'bottom',
									type: 'time',
									adapters: {
										date: {
											locale: es
										}
									}
								}
							}
						}
					}}
				/>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.body {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 0.5rem;
		height: 80%;

		:global(.card__wrapper) {
			flex: 1;
			height: 80% !important;
		}
	}

	.range__bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		white-space: nowrap;
		column-gap: 0.5rem;
	}

	:global(.ndvi__card) {
		flex: 1;
	}

	.chart__wrapper {
		width: 100%;
		height: 100%;
		min-width: 200px;
	}

	.date__picker {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
</style>
