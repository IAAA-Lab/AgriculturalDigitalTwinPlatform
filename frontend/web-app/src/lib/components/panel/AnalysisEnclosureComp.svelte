<script lang="ts">
	import AnalysisYearComp from '$lib/components/panel/AnalysisYearComp.svelte';
	import Card from '$lib/components/panel/Card.svelte';
	import CardInner from '$lib/components/panel/CardInner.svelte';
	import Chart from '$lib/components/panel/Chart.svelte';
	import { enclosuresService } from '$lib/config/config';
	import { listOfEnclosures } from '$lib/config/stores/selectedEnclosure';
	import { es } from 'date-fns/locale';
	import Loading from '../misc/Loading.svelte';
	import { getColor } from '$lib/core/functions';

	let startDate: string;
	let endDate: string;
	let LIMIT: number | undefined = 30;

	$: {
		if (startDate && endDate) {
			LIMIT = undefined;
		}
	}
</script>

<h1 class="pb-8">Análisis</h1>

<section>
	<Card>
		<div slot="header" class="header__wrapper">
			<div>
				<h2 class="m-0">Comparación de recintos</h2>
				<p class="text-sm m-0">Compara características de varios recintos</p>
			</div>
			<div class="header__input__wrapper">
				<div class="input__wrapper">
					<label for="date">Característica</label>
					<select>
						<option value="ndvi">NDVI</option>
					</select>
				</div>
				<div class="input__wrapper">
					<label for="date">Fecha de inicio</label>
					<input type="date" bind:value={startDate} />
				</div>
				<div class="input__wrapper">
					<label for="date">Fecha de fin</label>
					<input type="date" bind:value={endDate} />
				</div>
			</div>
		</div>
		<div slot="body" class="charts__wrapper">
			<div class="chart__wrapper">
				<CardInner>
					<div slot="header" class="chart__header">
						<div />
					</div>
					<div slot="body" class="chart">
						{#await enclosuresService.getNDVI($listOfEnclosures, new Date(startDate), new Date(endDate), LIMIT)}
							<Loading />
						{:then ndvi}
							<Chart
								data={{
									data: {
										datasets: ndvi.map(({ ndvi, enclosureId }, i) => ({
											type: 'line',
											data: ndvi.map((data) => ({
												x: data.date,
												y: data.value
											})),
											label: enclosureId,
											borderColor: getColor(i),
											tension: 0.2
										}))
									},
									options: {
										responsive: true,
										maintainAspectRatio: false,
										plugins: {
											legend: {
												position: 'right',
												labels: {
													usePointStyle: true,
													pointStyle: 'rectRounded',
													boxWidth: 10,
													font: {
														size: 14
													}
												}
											}
										},
										elements: {
											point: {
												radius: 0
											}
										},
										scales: {
											y: {
												type: 'linear',
												display: true,
												position: 'left',
												title: {
													display: true
												},
												min: -0.2,
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
						{/await}
					</div>
				</CardInner>
			</div>
		</div>
	</Card>
</section>

<style lang="scss">
	.charts__wrapper {
		// Two columns but it can be wrapped when the screen is too small
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		overflow-x: scroll;

		.chart {
			min-height: 250px;
			max-height: 450px;
			min-width: 600px;
		}

		.chart__wrapper {
			flex: 200px;
		}
	}

	input[type='number'] {
		min-width: 125px;
	}

	label {
		white-space: nowrap;
	}

	.header__wrapper,
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

	.header__input__wrapper {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	@include media('<medium') {
		.chart {
			min-width: 300px !important;
			max-height: 200px !important;
		}
		.input__wrapper {
			flex: 1;
			align-items: flex-start;
		}
	}
</style>
