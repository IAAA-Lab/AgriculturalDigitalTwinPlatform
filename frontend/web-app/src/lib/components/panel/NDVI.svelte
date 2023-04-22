<script lang="ts">
	import { enclosuresService } from '$lib/config/config';
	import { getRangeBarColor, numberWithCommas } from '$lib/core/functions';
	import { es } from 'date-fns/locale';
	import Loading from '../misc/Loading.svelte';
	import Card from './Card.svelte';
	import CardInner from './CardInner.svelte';
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
		<a href="/panel/enclosure/{enclosureId}/map">
			<Card>
				<h6 slot="header" class="m-0 mb-8">Salud de las plantas (NDVI)</h6>
				<svelte:fragment slot="body">
					{@const currentNdviValue = ndvi?.ndvi.at(-1)?.value}
					<CardInner>
						<div slot="body" class="ndvi__value__unit">
							<Range
								value={currentNdviValue ?? 0}
								to={1}
								background={getRangeBarColor(currentNdviValue ?? 0)}
							/>
							<h3 class="m-0">
								<strong>{numberWithCommas(currentNdviValue)}<strong /></strong>
							</h3>
						</div>
					</CardInner>
					<br />
					<CardInner>
						<div class="ndvi__chart" slot="body">
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
												borderColor: '#fc9b68',
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
													gradient.addColorStop(1, 'rgba(252, 155, 104,1)');
													return gradient;
												},
												tension: 0.2
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
					</CardInner>
				</svelte:fragment>
			</Card>
		</a>
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
