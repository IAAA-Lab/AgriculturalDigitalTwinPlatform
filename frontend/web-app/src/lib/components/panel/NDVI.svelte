<script lang="ts">
	import { enclosuresService } from '$lib/config/config';
	import { getRangeBarColor, numberWithCommas } from '$lib/core/functions';
	import { es } from 'date-fns/locale';
	import Loading from '../misc/Loading.svelte';
	import Range from '../misc/Range.svelte';
	import Chart from './Chart.svelte';
	import Error from '../misc/Error.svelte';

	export let enclosureId: string;
</script>

<section>
	{#await enclosuresService.getNDVI([enclosureId], undefined, undefined, 30)}
		<Loading />
	{:then ndviRes}
		{@const ndvi = ndviRes.at(0)}
		{@const currentNdviValue = ndvi?.ndvi.at(0)?.value}
		<div class="card">
			<a href="/panel/enclosure/{enclosureId}/map">
				<h6 class="m-0 mb-8">Salud de las plantas (NDVI)</h6>
				<div class="card-inner ndvi__value__unit mb-8">
					<Range
						value={currentNdviValue ?? 0}
						to={1}
						background={getRangeBarColor(currentNdviValue ?? 0)}
					/>
					<h3 class="m-0">
						<strong>{numberWithCommas(currentNdviValue)}<strong /></strong>
					</h3>
				</div>

				<div class="card-inner ndvi__chart">
					<Chart
						data={{
							data: {
								datasets: [
									{
										type: 'line',
										data: ndvi?.ndvi.map((ndvi) => ({
											x: ndvi.date.split('T')[0],
											y: ndvi.value
										})),
										fill: true,
										borderColor: '#800791',
										backgroundColor: function (context) {
											const chart = context.chart;
											const { ctx, chartArea } = chart;
											if (!chartArea) {
												return null;
											}
											const gradient = ctx.createLinearGradient(
												0,
												chartArea.bottom,
												0,
												chartArea.top
											);
											gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
											gradient.addColorStop(1, 'rgba(128, 7, 145,1)');
											return gradient;
										},
										tension: 0.2
									}
								]
							},
							options: {
								plugins: {
									title: {
										display: true,
										text: 'Últimos 30 días'
									},
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
										max: 1
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
			</a>
		</div>
	{:catch}
		<Error />
	{/await}
</section>

<style>
	section {
		grid-area: ndvi;
	}
	.ndvi__chart {
		height: 300px;
	}

	.ndvi__value__unit {
		display: flex;
		align-items: center;
		white-space: nowrap;
		column-gap: 0.5rem;
	}
</style>
