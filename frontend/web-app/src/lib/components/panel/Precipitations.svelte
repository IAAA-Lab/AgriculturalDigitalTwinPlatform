<script lang="ts">
	import type { HistoricalWeather } from '$lib/core/Domain';
	import Chart from './Chart.svelte';

	export let hw: HistoricalWeather[] = [];

	$: hw = hw?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
</script>

<div class="card">
	<i class="fi fi-rr-cloud-showers-heavy" />
	<p class="m-0">Precipitaciones (Últimos 7 días)</p>
	<div class="chart">
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
								const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
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
	</div>
</div>

<style lang="scss">
	.card {
		grid-area: precipitations;
		display: flex;
		flex-direction: column;

		&:last-child {
			flex: 1;
		}
	}
</style>
