<script lang="ts">
	import Chart from '$lib/components/panel/Chart.svelte';
	import ActivitiesTable from '$lib/components/panel/ActivitiesTable.svelte';
	import { digitalTwinsService } from '$lib/config/config';
	import { userEnclosures } from '$lib/config/stores/enclosures';
	import { getColor } from '$lib/core/functions';
	import type { Activity } from '../../core/Domain';

	export let digitalTwinId: string;

	let endDate = new Date();
	// endDate - 4 years
	let startDate = new Date(endDate.getFullYear() - 4, endDate.getMonth(), endDate.getDate());
	let startDateInput = startDate.toISOString().split('T')[0];
	let endDateInput = endDate.toISOString().split('T')[0];

	let activities: Activity[] = [];
	let selectedActivityType = '---- todas ----';
	let uniqueActivities: string[] = [];

	$: startDate = new Date(startDateInput);
	$: endDate = new Date(endDateInput);

	$: {
		digitalTwinsService
			.getActivities(digitalTwinId, undefined, startDate, endDate)
			.then((activitiesList) => {
				activities = activitiesList;
				// Get all unique products
				uniqueActivities = [...new Set(activitiesList.map((activity) => activity.activity))];
			})
			.catch((error) => {
				activities = [];
				uniqueActivities = [];
			});
	}
</script>

<div class="card">
	<h1>Actividades</h1>
	<div class="header mb-16">
		<select bind:value={selectedActivityType}>
			<option value="---- todas ----">---- todas ----</option>
			{#each [...new Set(activities.map((activity) => activity.activity))] as activityType}
				<option value={activityType}>{activityType}</option>
			{/each}
		</select>
		<div class="input__dates__wrapper">
			<input type="date" bind:value={startDateInput} />
			<input type="date" bind:value={endDateInput} />
		</div>
	</div>
	<div class="body p-8">
		<div class="card-inner table__inner">
			<ActivitiesTable
				activities={selectedActivityType === '---- todas ----'
					? activities
					: activities.filter((activity) => activity.activity === selectedActivityType)}
			/>
		</div>
		<div class="chart__doughnut__line__wrapper">
			<div class="card-inner chart__doughnut__wrapper">
				<h4 class="m-0 mb-16">Número de actividades</h4>
				<div class="chart__doughnout">
					<Chart
						data={{
							type: 'doughnut',
							data: {
								datasets: [
									{
										label: '',
										// Count number of activities for each type
										data: uniqueActivities.map(
											(activity) => activities.filter((a) => a.activity === activity).length
										),
										// Map each product to a random color
										backgroundColor: uniqueActivities.map((_, i) => `${getColor(i)}9C`),
										borderColor: uniqueActivities.map((_, i) => getColor(i)),
										borderWidth: 1
									}
								],
								labels: uniqueActivities
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
										data: activities
											.filter((activity) => activity.activity === selectedActivityType)
											.map((phyto) => {
												return {
													x: phyto.date.toString().split('T')[0],
													y: 1
												};
											}),
										fill: false,
										backgroundColor: '#5FAC45',
										tension: 0,
										maxBarThickness: 5,
										borderWidth: 0
									}
								],
								labels: activities.map((phyto) => phyto.date.toString().split('T')[0])
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
										text: 'Histórico de actividades',
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
											text: 'Unidades',
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
		grid-area: activities;
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
