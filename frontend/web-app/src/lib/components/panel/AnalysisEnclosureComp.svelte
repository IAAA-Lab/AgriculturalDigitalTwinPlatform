<script lang="ts">
	import Card from '$lib/components/panel/Card.svelte';
	import CardInner from '$lib/components/panel/CardInner.svelte';
	import { enclosuresService } from '$lib/config/config';
	import { getColor } from '$lib/core/functions';
	import { es } from 'date-fns/locale';
	import Chart from './Chart.svelte';
	import type { NDVI } from '$lib/core/Domain';

	let endDate: string = new Date().toISOString().split('T')[0];
	let startDate: string = new Date(new Date().setDate(new Date().getDate() - 30))
		.toISOString()
		.split('T')[0];
	let MAX_ENCLOSURES = 10;
	let collapsed = false;
	export let listOfEnclosures: string[] = [];
	let ndvi: NDVI[] = [];

	$: {
		enclosuresService
			.getNDVI(
				listOfEnclosures.slice(0, MAX_ENCLOSURES),
				new Date(startDate),
				new Date(endDate),
				undefined
			)
			.then((ndviRes) => {
				ndvi = [...ndviRes];
			})
			.catch((err) => {});
	}
</script>

<div class="dropdown__wrapper" class:collapsed>
	<button
		class="button-xs button-secondary dropdown__close"
		on:click={() => (collapsed = !collapsed)}
	>
		<i class="fi fi-rr-angle-down" />
	</button>
	<Card>
		<div slot="header" class="header__wrapper">
			<div>
				<h2 class="m-0">Comparación de recintos</h2>
				<p class="m-0">Compara características de varios recintos</p>
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
					</div>
				</CardInner>
			</div>
		</div>
	</Card>
</div>

<style lang="scss">
	.dropdown__wrapper {
		position: relative;
		max-height: 350px;
		transition: max-height 0.1s ease-in;
		overflow: hidden;
		&.collapsed {
			max-height: 40px;
		}
	}
	.dropdown__close {
		position: absolute;
		top: 5px;
		right: 5px;
		font-size: 0.4rem;
	}
	.charts__wrapper {
		// Two columns but it can be wrapped when the screen is too small
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		overflow-x: scroll;

		.chart {
			min-width: 500px;
			max-height: 200px;
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
