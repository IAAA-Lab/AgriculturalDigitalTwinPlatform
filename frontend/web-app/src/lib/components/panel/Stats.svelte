<script lang="ts">
	import { enclosuresService } from '$lib/config/config';
	import type { NDVI, HistoricalWeather } from '$lib/core/Domain';
	import { getRangeBarColor, numberWithCommas } from '$lib/core/functions';
	import 'chartjs-adapter-date-fns';
	import { es } from 'date-fns/locale';
	import Card from './Card.svelte';
	import CardInner from './CardInner.svelte';
	import Range from '../misc/Range.svelte';
	import Chart from './Chart.svelte';

	export let enclosureId: string;
	export let idema: string;
	let startDateText: string;
	let endDateText: string;
	let ndviValues: NDVI[] = [];
	let weatherValues: HistoricalWeather[] = [];

	const LIMIT = 30;

	$: {
		enclosuresService
			.getNDVI(
				[enclosureId],
				new Date(startDateText),
				new Date(endDateText),
				startDateText && endDateText ? 0 : LIMIT
			)
			.then((ndvi) => {
				ndviValues = ndvi;
				enclosuresService
					.getHistoricalWeather(
						idema,
						new Date(ndvi.at(0)?.date || startDateText),
						new Date(ndvi.at(-1)?.date || endDateText)
					)
					.then((weather) => {
						weatherValues = weather;
					})
					.catch((error) => {
						weatherValues = [];
					});
			})
			.catch((error) => {
				ndviValues = [];
			});
	}
</script>

<Card>
	<div slot="body" class="p-8 body">
		<div class="left">
			<h4 class="m-0">Media</h4>
			<CardInner class="ndvi__card">
				<div slot="body" class="range__bar">
					{@const ndviAvg = ndviValues.reduce((a, b) => a + b?.value, 0) / ndviValues.length}
					<Range value={ndviAvg} to={1} background={getRangeBarColor(ndviAvg)} />
					<h3 class="m-0">
						<strong>{numberWithCommas(ndviAvg)}<strong /></strong>
					</h3>
				</div>
			</CardInner>
			<div class="date__picker">
				<input type="date" bind:value={startDateText} />
				<input type="date" bind:value={endDateText} />
			</div>
		</div>
		<CardInner class="card__wrapper">
			<div class="chart__wrapper" slot="body">
				<Chart
					data={{
						data: {
							datasets: [
								{
									type: 'line',
									data: ndviValues?.map((ndvi) => ({
										x: new Date(ndvi.date),
										y: ndvi.value
									})),
									label: 'ndvi',
									fill: true,
									borderColor: '#fc9b68',
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
									borderColor: '#blue',
									backgroundColor: 'blue',
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
		</CardInner>
	</div>
</Card>

<style lang="scss">
	.body {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 2rem;

		:global(.card__wrapper) {
			flex: 3;
		}
	}

	.left {
		flex: 1;
		min-width: 250px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		gap: 1rem;
	}

	.range__bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		white-space: nowrap;
		column-gap: 0.5rem;
	}

	:global(.ndvi__card) {
		width: 95%;
	}

	.chart__wrapper {
		max-height: 600px;
		min-height: 300px;
		height: 100%;
		width: 100%;
		min-width: 200px;
	}

	.date__picker {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
</style>
