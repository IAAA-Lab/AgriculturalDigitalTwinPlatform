<script lang="ts">
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

<div class="header">
	<div>
		<h2 class="m-0">Comparación de recintos</h2>
		<p class="m-0">Compara características de varios recintos</p>
	</div>
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
<div class="card-inner">
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

<style lang="scss">
	.card-inner {
		height: 225px;
	}
	input[type='number'] {
		min-width: 125px;
	}

	label {
		white-space: nowrap;
	}

	.header {
		display: flex;
		align-items: center;
		row-gap: 0.5rem;
		margin-bottom: 1rem;
		padding: 0 0.5rem;

		:nth-child(2) {
			margin-left: auto;
			margin-right: 0.75rem;
		}
	}

	.input__wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	@include media('<medium') {
		.input__wrapper {
			flex: 1;
			align-items: flex-start;
		}

		button {
			display: none;
		}

		.header {
			flex-wrap: wrap;
		}
	}
</style>
