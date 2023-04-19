<script lang="ts">
	import Chart from './Chart.svelte';
	import WeatherStat from './WeatherStat.svelte';
	export let minTa: number;
	export let maxTa: number;
	export let taData: { period: string; value: number }[];
</script>

<div class="temp">
	<WeatherStat title="Temperatura">
		<i slot="header-icon" class="fi fi-rr-temperature-low pt-4" />
		<svelte:fragment slot="body">
			<div class="chart-wrap">
				<Chart
					data={{
						data: {
							datasets: [
								{
									type: 'line',
									borderWidth: 3,
									borderColor: '#414242',
									tension: 0.5,
									pointRadius: 1,
									data: taData.map((ta) => ({
										x: ta.period,
										y: ta.value
									}))
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
									grid: {
										drawBorder: false
									}
								}
							}
						}
					}}
				/>
			</div>
			<div class="min-max text-xs mt-4">
				<span style="color: #E54C4C;">Mín: {minTa} °</span>
				<span style="color: #524EF4;">Máx: {maxTa} °</span>
			</div>
		</svelte:fragment>
	</WeatherStat>
</div>

<style>
	.min-max {
		display: flex;
		align-items: center;
		justify-content: space-evenly;
	}

	.chart-wrap {
		height: 125px;
	}

	.temp {
		grid-area: temp;
	}
</style>
