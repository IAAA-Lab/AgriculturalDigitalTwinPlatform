<script lang="ts">
	import Card from '$lib/components/panel/Card.svelte';
	import CardInner from '$lib/components/panel/CardInner.svelte';
	import Chart from '$lib/components/panel/Chart.svelte';
	import PhytosTable from '$lib/components/panel/PhytosTable.svelte';
	import { enclosuresService } from '$lib/config/config';
	import type { Treatment } from '$lib/core/Domain';
	import { getColor } from '$lib/core/functions';

	export let enclosureId: string;

	let startDate = new Date('2021-03-03');
	let endDate = new Date('2023-03-03');
	let startDateInput = startDate.toISOString().split('T')[0];
	let endDateInput = endDate.toISOString().split('T')[0];

	let treatments: Treatment[] = [];

	$: startDate = new Date(startDateInput);
	$: endDate = new Date(endDateInput);

	$: {
		enclosuresService
			.getActivities(enclosureId, startDate, endDate)
			.then((activitiesList) => {
				// Filter activities by activity type = 'TRATAMIENTO FITOSANITARIO'
				treatments = activitiesList
					.filter((activity) => activity.activity === 'TRATAMIENTO FITOSANITARIO')
					.map((activity) => {
						return {
							date: activity.date,
							...activity.properties
						};
					}) as Treatment[];
			})
			.catch((error) => {
				treatments = [];
			});
	}
</script>

<Card>
	<div slot="header" class="header mb-16">
		<h2 class="m-0">Tratamientos</h2>
		<div class="input__dates__wrapper">
			<input type="date" bind:value={startDateInput} />
			<input type="date" bind:value={endDateInput} />
		</div>
	</div>
	<div slot="body" class="body p-8">
		<CardInner>
			<div slot="body" class="table__inner">
				<PhytosTable {treatments} />
			</div>
		</CardInner>
		<div class="chart__doughnut__line__wrapper">
			<CardInner class="chart__doughnut__wrapper">
				<h4 slot="header" class="m-0 mb-16">Dosis aplicada por producto</h4>
				<div slot="body" class="chart__doughnout">
					<!-- Sum all unique products dosages to a list -->
					{@const uniqueProducts = [
						...new Set(treatments.map((phyto) => phyto.phytosanitary.name))
					]}
					{@const productsDosages = uniqueProducts.map((product) => {
						const productPhytos = treatments.filter(
							(phyto) => phyto.phytosanitary.name === product
						);
						return productPhytos.reduce((acc, curr) => acc + curr.quantity, 0);
					})}
					<Chart
						data={{
							type: 'doughnut',
							data: {
								datasets: [
									{
										label: '',
										data: productsDosages,
										// Map each product to a random color
										backgroundColor: uniqueProducts.map((_, i) => `${getColor(i)}9C`),
										borderColor: uniqueProducts.map((_, i) => getColor(i)),
										borderWidth: 1
									}
								],
								labels: uniqueProducts
							},
							options: {
								cutout: '70%',
								responsive: true,
								maintainAspectRatio: false,
								plugins: {
									legend: {
										position: 'right',
										labels: {
											color: '#6b7280',
											usePointStyle: true,
											pointStyle: 'rectRounded',
											boxWidth: 10,
											font: {
												size: 14
											}
										}
									}
								}
							}
						}}
					/>
				</div>
			</CardInner>
			<CardInner class="chart__line__wrapper">
				<div slot="body" class="chart__line">
					<Chart
						data={{
							type: 'bar',
							data: {
								datasets: [
									{
										label: '',
										data: treatments.map((phyto) => phyto.quantity),
										fill: false,
										borderColor: '#2F3030',
										tension: 0.3,
										maxBarThickness: 40,
										borderWidth: 2
									}
								],
								labels: treatments.map((phyto) => phyto.date.toString().split('T')[0])
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
											const gradient = ctx.createLinearGradient(
												0,
												chartArea.bottom,
												0,
												chartArea.top
											);
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
									},
									title: {
										display: true,
										text: 'Dosis aplicada por fecha',
										font: {
											size: 16,
											weight: 'bold'
										}
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
											text: 'Dosis (L/ha)',
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
			</CardInner>
		</div>
	</div>
</Card>

<style lang="scss">
	.header {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		column-gap: 0.5rem;
	}

	.body {
		display: flex;
		flex-direction: column;
		row-gap: 1rem;
	}

	.table__inner {
		height: 300px;
		overflow: scroll;
	}

	.table__pie__chart__wrapper {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 1rem;

		:global(.chart__pie__wrapper) {
			flex: 1;
			min-width: 275px;
		}
	}

	.chart__doughnut__line__wrapper {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		overflow-x: scroll;

		:global(.chart__doughnut__wrapper) {
			flex: 3;
			min-width: 275px;
		}

		:global(.chart__line__wrapper) {
			flex: 7;
			min-width: 275px;
		}
		gap: 1rem;
	}

	.chart__pie {
		height: 140px;
	}
	.chart__line {
		height: 300px;
	}
	.chart__doughnout {
		height: 200px;
	}

	.chart__pie__body {
		display: flex;
		height: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: space-evenly;
	}

	.input__dates__wrapper {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		align-items: center;
		column-gap: 0.5rem;
	}
</style>
