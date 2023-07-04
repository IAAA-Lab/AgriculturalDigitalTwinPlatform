<script lang="ts">
	import { es } from 'date-fns/locale';
	import Chart from './Chart.svelte';
	import { enclosuresService } from '$lib/config/config';
	import CardInner from './CardInner.svelte';
	import type { Activity, HistoricalWeather, NDVI } from '$lib/core/Domain';

	export let startDate: string;
	export let selectedEnclosure: string;
	export let limit: number;
	// TODO: get idema from selectedEnclosure
	export let idema = '9434';

	let resetZoom: () => void = () => {};
	let uniqueActivities: Activity[] = [];
	let selectedActivity: string | undefined;

	let endDate: Date;
	let ndviValues: NDVI | null = null;
	let weatherValues: HistoricalWeather[] = [];

	$: {
		enclosuresService
			.getNDVI([selectedEnclosure], new Date(startDate), new Date(endDate), undefined)
			.then((ndvi) => {
				ndviValues = ndvi[0];
			})
			.catch((error) => {
				ndviValues = null;
			});
	}

	$: {
		enclosuresService
			.getHistoricalWeather(idema, new Date(startDate), new Date(endDate), ['date', 'prec'])
			.then((weather) => {
				weatherValues = [...weather];
			})
			.catch((error) => {
				weatherValues = [];
			});
	}

	$: {
		// If selectedActivity is empty, get all activities
		enclosuresService
			.getActivities([selectedEnclosure], new Date(startDate), new Date(endDate))
			.then((activityList) => {
				const activities = [...new Set([...activityList])];
				uniqueActivities = [...activities];
				selectedActivity = activities.at(0)?.activities[0].activity;
			})
			.catch((error) => {
				uniqueActivities = [];
			});
	}

	$: endDate = new Date(new Date(startDate).setDate(new Date(startDate).getDate() + limit));
</script>

<CardInner>
	<div slot="header" class="header">
		<div class="chart__header">
			<div class="input__wrapper">
				<label for="date">Fecha de inicio</label>
				<input type="date" bind:value={startDate} />
			</div>
			<div class="input__wrapper" style="flex: 1;">
				{#if uniqueActivities.length > 0}
					<label>Actividades</label>
					<!--NOTE: If I use bind:value, the whole component is re-rendered, I don't know why-->
					<select
						value={selectedActivity}
						on:change={(e) => (selectedActivity = e.target?.value ?? '')}
					>
						{#each uniqueActivities as activity}
							<option value={activity.activities[0].activity}
								>{activity.activities[0].activity}</option
							>
						{/each}
					</select>
				{/if}
			</div>
		</div>
		<button class="button-secondary button-xs" on:click={() => resetZoom()}>Zoom</button>
	</div>

	<div slot="body" class="chart">
		<Chart
			bind:resetZoom
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
							borderColor: ndviValues ? '#fc9b68' : 'transparent',
							backgroundColor: 'transparent',
							tension: 0.2,
							yAxisID: 'y1'
						},
						{
							type: 'bar',
							data: weatherValues?.map((weather) => ({
								x: weather.date,
								y: weather.prec
							})),
							label: weatherValues ? 'lluvias' : '',
							fill: true,
							backgroundColor: weatherValues ? 'blue' : 'transparent',
							tension: 0.2,
							yAxisID: 'y',
							barPercentage: 4,
							categoryPercentage: 1
						},
						{
							type: 'bar',
							data: uniqueActivities
								.filter((activity) => activity.activities[0].activity === selectedActivity)
								.map((activity) => ({
									x: activity.activities[0].date,
									y: 1
								})),
							label: selectedActivity || '',
							fill: true,
							backgroundColor: selectedActivity ? 'green' : 'transparent',
							yAxisID: 'y2',
							barPercentage: 1,
							categoryPercentage: 1
						}
					]
				},
				options: {
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
						pan: {
							enabled: true,
							mode: 'x'
						},
						zoom: {
							zoom: {
								wheel: {
									enabled: true
								},
								pinch: {
									enabled: true
								},
								mode: 'x'
							}
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

<style lang="scss">
	.chart {
		min-height: 300px;
		max-height: 350px;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: start;
	}

	.chart__header {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
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
</style>
