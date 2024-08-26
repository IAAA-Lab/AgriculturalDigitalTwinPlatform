<script lang="ts">
	import { es } from 'date-fns/locale';
	import Chart from './Chart.svelte';
	import { digitalTwinsService } from '$lib/config/config';
	import type { NDVI } from '$lib/core/Domain';

	export let enclosureIds: string[] = [];
	let startDate: string = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
		.toISOString()
		.split('T')[0];
	let endDate: string = new Date().toISOString().split('T')[0];

	let zoomLevel: number = 0;
	let ndviList: NDVI[] | null = null;

	$: {
		if (enclosureIds && enclosureIds.length > 0) {
			digitalTwinsService
				.getNDVI(enclosureIds, new Date(startDate), new Date(endDate), undefined)
				.then((ndvi) => {
					ndviList = ndvi;
				})
				.catch((error) => {
					ndviList = null;
				});
		}
	}
</script>

<div class="wrapper">
	<div class="chart__header">
		<input type="date" bind:value={startDate} />
		<input type="date" bind:value={endDate} />
		<button class="button-secondary button-xs" on:click={() => (zoomLevel = 0)}>
			<i class="fi fi-rr-expand" />
		</button>
	</div>

	<div class="chart">
		<Chart
			bind:zoomLevel
			data={{
				data: {
					datasets: ndviList?.map((ndvi) => ({
						type: 'line',
						data: ndvi.ndvi.map((ndvi) => ({
							x: new Date(ndvi.date),
							y: ndvi.value
						})),
						label: ndvi.enclosureId
					}))
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
							}
						}
					},

					maintainAspectRatio: false,
					scales: {
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
						},
						y: {
							type: 'linear',
							max: 1,
							min: 0
						}
					}
				}
			}}
		/>
	</div>
</div>

<style>
	.wrapper {
		display: flex;
		height: 95%;
		flex-direction: column;
	}
	.chart {
		flex: 1;
		height: 100%;
	}
	.chart__header {
		display: flex;
		flex-direction: row;
		align-items: center;

		&:last-child {
			margin-left: auto;
		}
	}
</style>
