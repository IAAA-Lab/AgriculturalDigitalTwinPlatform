<script lang="ts">
	import { enclosuresService } from '$lib/config/config';
	import type { HistoricalWeather, NDVI } from '$lib/core/Domain';
	import { es } from 'date-fns/locale';
	import Chart from './Chart.svelte';

	export let startDate: string;
	export let endDate: string = new Date().toISOString().split('T')[0];
	export let enclosures: string[] | undefined = undefined;
	export let limit: number | undefined = undefined;
	export let idema: string | undefined = undefined;
	export let maxPrecipitation: number = 0;
	export let selectedDate: string | undefined = undefined;
	export let minDate: number = 0;
	let resetZoom: () => void = () => {};

	let clickedPoint: any = null;
	let activities: any[] = [];
	let cropStats: any[] = [];
	let selectedActivity: string | undefined;

	let ndviValues: NDVI | null = null;
	let weatherValues: HistoricalWeather[] = [];

	$: {
		if (enclosures && enclosures.length > 0) {
			enclosuresService
				.getNDVI(enclosures, new Date(startDate), new Date(endDate), undefined)
				.then((ndvi) => {
					ndviValues = ndvi[0];
				})
				.catch((error) => {
					ndviValues = null;
				});
		}
	}

	$: {
		if (idema) {
			enclosuresService
				.getHistoricalWeather(idema, new Date(startDate), new Date(endDate), [
					'date',
					'prec',
					'tmed'
				])
				.then((weather) => {
					weatherValues = [...weather];
				})
				.catch((error) => {
					weatherValues = [];
				});
		}
	}

	$: {
		if (enclosures && enclosures.length > 0) {
			enclosuresService
				.getActivities(enclosures, new Date(startDate), new Date(endDate))
				.then((activityList) => {
					const activitiesFlat = [...activityList.flatMap((activity) => activity.activities)];
					selectedActivity = activitiesFlat.at(0)?.activity;
					activities = activitiesFlat;
				})
				.catch((error) => {
					activities = [];
				});
		}
	}

	$: {
		if (enclosures && enclosures.length > 0) {
			enclosuresService
				.getCropStats(enclosures[0], new Date(startDate), new Date(endDate))
				.then((stats) => {
					cropStats = [...stats];
					// .sort((a, b) => b.value - a.value);
				});
		}
	}

	$: {
		if (!limit) {
			endDate = new Date().toISOString().split('T')[0];
		} else {
			endDate = new Date(new Date(startDate).setDate(new Date(startDate).getDate() + limit))
				.toISOString()
				.split('T')[0];
		}
	}

	$: {
		const maxPrecipitationCalc = Math.max(...weatherValues.map((w) => w.prec).filter((w) => w));
		maxPrecipitation =
			maxPrecipitationCalc > maxPrecipitation
				? Math.ceil(maxPrecipitationCalc * 1.1)
				: maxPrecipitation;
	}

	$: {
		selectedDate = clickedPoint?.value?.x.split('T')[0];
	}
</script>

<div class="wrapper">
	<div class="chart__header">
		<input type="date" bind:value={startDate} />
		{#if !limit}
			<input type="date" bind:value={endDate} />
		{/if}
		<div class="input__wrapper" style="flex: 1;">
			{#if activities.length > 0}
				<label>Actividades</label>
				<!--NOTE: If I use bind:value, the whole component is re-rendered, I don't know why-->
				<select
					value={selectedActivity}
					on:change={(e) => {
						selectedActivity = e.target?.value;
					}}
				>
					{#each [...new Set(activities.map((activity) => activity.activity))] as activity}
						<option value={activity}>{activity}</option>
					{/each}
				</select>
			{/if}
		</div>
		<button class="button-secondary button-xs" on:click={() => resetZoom()}>
			<i class="fi fi-rr-expand" />
		</button>
	</div>

	<div class="chart">
		<Chart
			bind:resetZoom
			bind:clickedPoint
			data={{
				data: {
					datasets: [
						{
							type: 'line',
							data: ndviValues?.ndvi.map((ndvi) => ({
								x: ndvi.date,
								y: ndvi.value
							})),
							label: ndviValues ? 'ndvi' : '',
							fill: true,
							borderColor: ndviValues ? '#800791' : 'transparent',
							backgroundColor: 'transparent',
							tension: 0.2,
							pointRadius: 0,
							yAxisID: 'y1'
						},
						{
							type: 'line',
							data: weatherValues?.map((weather) => ({
								x: weather.date,
								y: weather.tmed
							})),
							label: weatherValues ? 'temperatura' : '',
							fill: true,
							borderColor: weatherValues ? '#E02D07CC' : 'transparent',
							backgroundColor: 'transparent',
							tension: 0.3,
							yAxisID: 'ytmed',
							pointRadius: 0,
							hidden: true
						},
						{
							type: 'bar',
							data: weatherValues?.map((weather) => ({
								x: weather.date,
								y: weather.prec
							})),
							label: weatherValues ? 'lluvias' : '',
							fill: true,
							backgroundColor: weatherValues ? '#076F91' : 'transparent',
							tension: 0.2,
							yAxisID: 'y',
							barThickness: 5
						},
						{
							type: 'bar',
							data: activities
								.filter((activity) => activity.activity === selectedActivity)
								.map((activity) => ({
									x: activity.date,
									y: 1
								})),
							label: selectedActivity || '',
							fill: true,
							backgroundColor: selectedActivity ? 'black' : 'transparent',
							yAxisID: 'y2',
							barThickness: 1.5
						},
						{
							type: 'bar',
							data: cropStats.map((crop) => ({
								x: crop.plantingDate,
								y: 1
							})),
							label: cropStats.length > 0 ? 'siembra' : '',
							fill: true,
							backgroundColor: cropStats.length > 0 ? 'brown' : 'transparent',
							yAxisID: 'y2',
							barThickness: 3
						},
						{
							type: 'bar',
							data: cropStats.map((crop) => ({
								x: crop.harvestDate,
								y: 1
							})),
							label: cropStats.length > 0 ? 'cosecha' : '',
							fill: true,
							backgroundColor: cropStats.length > 0 ? 'green' : 'transparent',
							yAxisID: 'y2',
							barThickness: 3
						}
					]
				},
				options: {
					animation: false,
					plugins: {
						legend: {
							position: 'top',
							labels: {
								usePointStyle: true,
								pointStyle: 'rectRounded',
								boxWidth: 10,
								font: {
									size: 14
								}
							}
						},
						zoom: {
							zoom: {
								mode: 'x',
								drag: {
									enabled: true,
									borderWidth: 1,
									backgroundColor: 'rgba(225,225,225,0.3)'
								}
								// onZoomComplete: ({ chart }) => {
								// 	minDate = chart.scales.x.min;
								// 	maxDate = chart.scales.x.max;
								// }
							}
						}
					},
					maintainAspectRatio: false,
					scales: {
						y: {
							type: 'linear',
							display: true,
							position: 'left',
							title: {
								display: true,
								text: 'Lluvias (mm)'
							},
							min: 0,
							max: maxPrecipitation
						},
						y1: {
							type: 'linear',
							display: true,
							position: 'right',
							title: {
								display: true,
								text: 'NDVI'
							},
							beginAtZero: false,
							max: 1,
							min: -0.2,
							grid: {
								drawOnChartArea: false
							}
						},
						y2: {
							type: 'linear',
							display: false,
							position: 'right',
							beginAtZero: false,
							max: 1,
							min: 0,
							grid: {
								drawOnChartArea: false
							}
						},
						ytmed: {
							type: 'linear',
							display: false,
							beginAtZero: false,
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
</div>

<style lang="scss">
	.chart__header {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: start;
		gap: 1rem;
		margin-bottom: 1rem;
		padding: 0 0.5rem;
	}

	.input__wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	select {
		width: 100%;
	}

	.chart {
		flex: 1;
		height: 85%;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
</style>
