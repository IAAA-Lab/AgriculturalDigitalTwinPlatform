<script lang="ts">
	import Chart from '$lib/components/panel/Chart.svelte';
	import PhytosTable from '$lib/components/panel/PhytosTable.svelte';
	import { enclosuresService } from '$lib/config/config';
	import type { Treatment } from '$lib/core/Domain';
	import { getColor } from '$lib/core/functions';

	export let enclosureId: string;

	let endDate = new Date();
	// endDate - 4 years
	let startDate = new Date(endDate.getFullYear() - 4, endDate.getMonth(), endDate.getDate());
	let startDateInput = startDate.toISOString().split('T')[0];
	let endDateInput = endDate.toISOString().split('T')[0];

	let treatments: Treatment[] = [];
	let uniqueProducts: string[] = [];

	$: startDate = new Date(startDateInput);
	$: endDate = new Date(endDateInput);

	$: {
		enclosuresService
			.getActivities([enclosureId], startDate, endDate)
			.then((activitiesList) => {
				// Filter activities by activity type = 'TRATAMIENTO FITOSANITARIO'
				const activities = activitiesList.find((activity) => activity.enclosureId === enclosureId);
				const treatmentsList = activities?.activities
					.filter((activity) => activity.activity === 'TRATAMIENTO FITOSANITARIO')
					.map((activity) => {
						return {
							date: activity.date,
							...activity.properties
						};
					}) as Treatment[];
				treatments = [...treatmentsList];
				// Get all unique products
				uniqueProducts = [...new Set(treatmentsList.map((phyto) => phyto.phytosanitary.name))];
			})
			.catch((error) => {
				treatments = [];
				uniqueProducts = [];
			});
	}
</script>

<div class="card">
	<div class="header mb-16">
		<h2 class="m-0">Tratamientos</h2>
		<div class="input__dates__wrapper">
			<input type="date" bind:value={startDateInput} />
			<input type="date" bind:value={endDateInput} />
		</div>
	</div>
	<div class="body p-8">
		<div class="card-inner table__inner">
			<PhytosTable {treatments} />
		</div>
		<div class="chart__doughnut__line__wrapper">
			<div class="card-inner chart__doughnut__wrapper">
				<h4 class="m-0 mb-16">Dosis aplicada por producto</h4>
				<div class="chart__doughnout">
					<Chart
						data={{
							type: 'doughnut',
							data: {
								datasets: [
									{
										label: '',
										data: uniqueProducts.map((product) => {
											const productPhytos = treatments.filter(
												(phyto) => phyto.phytosanitary.name === product
											);
											return productPhytos.reduce((acc, curr) => acc + curr.quantity, 0);
										}),
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
			</div>
			<div class="card-inner chart__line__wrapper">
				<div class="chart__line">
					<Chart
						data={{
							type: 'bar',
							data: {
								datasets: [
									{
										label: '',
										data: treatments.map((phyto) => phyto.quantity),
										fill: false,
										backgroundColor: '#5FAC45',
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
										borderWidth: 0
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
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.card {
		grid-area: treatments;
	}

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
