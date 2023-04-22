<script lang="ts">
	import { es } from 'date-fns/locale';
	import Chart from './Chart.svelte';
	import { enclosuresService } from '$lib/config/config';
	import CardInner from './CardInner.svelte';
	import { onMount } from 'svelte';
	import type { HistoricalWeather, NDVI } from '$lib/core/Domain';

	export let startDate: string;
	export let selectedEnclosure: string;
	export let limit: number;
	export let idema = '9434';

	let endDate: Date;
	let ndviValues: NDVI | null = null;
	let weatherValues: HistoricalWeather[] = [];

	onMount(() => {
		enclosuresService
			.getNDVI([selectedEnclosure], new Date(startDate), new Date(endDate), undefined)
			.then((ndvi) => {
				ndviValues = ndvi[0];
				enclosuresService
					.getHistoricalWeather(
						idema,
						new Date(ndvi[0].ndvi.at(-1)?.date || startDate),
						new Date(ndvi[0].ndvi.at(0)?.date || endDate)
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
			});
	});

	$: endDate = new Date(new Date(startDate).setDate(new Date(startDate).getDate() + limit));
</script>

<div class="chart__wrapper">
	<CardInner>
		<div slot="header" class="chart__header">
			<div class="input__wrapper">
				<label for="date">Fecha de inicio</label>
				<input type="date" bind:value={startDate} />
			</div>
		</div>
		<div slot="body" class="chart">
			<Chart
				data={{
					type: 'line',
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
						plugins: {
							legend: {
								display: false
							}
						},
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
								min: -0.2,
								grid: {
									drawOnChartArea: false
								}
							},
							x: {
								display: true,
								position: 'bottom',
								type: 'time',
								min: new Date(startDate),
								max: new Date(endDate),
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

<style lang="scss">
	.chart {
		min-height: 300px;
		max-height: 350px;
		min-width: 700px;
	}

	.chart__wrapper {
		flex: 300px;
	}

	.chart__header {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		row-gap: 0.5rem;
		margin-bottom: 1rem;
		padding: 0 0.5rem;
	}

	.input__wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}
	@include media('<small') {
		.chart {
			min-width: 100% !important;
		}
	}
</style>
