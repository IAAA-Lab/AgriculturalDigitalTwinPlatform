<script lang="ts">
	import Chart from './Chart.svelte';
	import WeatherStat from './WeatherStat.svelte';

	export let minHr = '--';
	export let maxHr = '--';
	export let hrData: { period: number; value: number }[] = [];
</script>

<div class="hum">
	<WeatherStat title="Humedad">
		<i slot="header-icon" class="fi fi-rr-humidity pt-4" />
		<div slot="body" class="body">
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
									data: hrData.map((hr) => ({
										x: hr.period,
										y: hr.value
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
									},
									ticks: {
										autoSkip: true,
										maxTicksLimit: 6
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
			<p class="m-0"><strong>{minHr} %</strong></p>
		</div>
	</WeatherStat>
</div>

<style>
	.body {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.hum {
		grid-area: humidity;
	}

	.chart-wrap {
		height: 110px;
	}
</style>
