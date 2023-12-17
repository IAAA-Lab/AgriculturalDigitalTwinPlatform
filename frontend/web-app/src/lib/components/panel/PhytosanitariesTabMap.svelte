<script lang="ts">
	import { enclosuresService } from '$lib/config/config';
	import { getColor } from '$lib/core/functions';
	import Chart from './Chart.svelte';
	import TablePagination from './TablePagination.svelte';

	export let enclosureIds: string[] = [];
	let startDate: string = new Date(new Date().setFullYear(new Date().getFullYear() - 4))
		.toISOString()
		.split('T')[0];
	let endDate: string = new Date().toISOString().split('T')[0];
	let plaguesByCropAccum: any[] = [];
	let phytoApplicationByDateAccum: any[] = [];
	let phytoSanitaries: any[] = [];

	$: {
		enclosuresService
			.getActivities(enclosureIds, new Date(startDate), new Date(endDate), undefined)
			.then((phytosanitariesList) => {
				const phytos = phytosanitariesList
					// Is in enclosureIds
					.filter((phyto) => enclosureIds.includes(phyto.enclosureId))
					.flatMap((phyto) => phyto.activities)
					.filter((phyto) => phyto.activity === 'TRATAMIENTO FITOSANITARIO')
					.map((phyto) => {
						return {
							date: phyto.date,
							cropId: phyto.cropId,
							...phyto.properties
						};
					});
				phytoSanitaries = phytos.slice(0, 5);
				// Plagues by crop
				plaguesByCropAccum = phytos.reduce((acc, phyto) => {
					const crop = phyto.cropId;
					const plague = phyto.plague.name;
					const index = acc.findIndex((item) => item.crop === crop && item.plague === plague);
					if (index === -1) {
						acc.push({
							crop,
							plague,
							count: 1
						});
					} else {
						acc[index].count++;
					}
					return acc;
				}, []);
				console.log(plaguesByCropAccum.sort((a, b) => b.count - a.count));
			})
			.catch((error) => {});
	}
</script>

<div class="wrapper">
	<div class="chart__header">
		<input type="date" bind:value={startDate} />
		<input type="date" bind:value={endDate} />
	</div>
	<div class="chart__pie">
		<Chart
			data={{
				type: 'pie',
				data: {
					datasets: []
				},
				options: {
					animation: false,

					plugins: {
						labels: [
							{
								render: 'label',
								fontColor: '#000',
								position: 'outside'
							},
							{
								render: 'percentage',
								fontColor: ['green', 'white', 'red'],
								precision: 2
							}
						],
						legend: {
							position: 'top',
							labels: {
								usePointStyle: true,
								pointStyle: 'rectRounded',
								boxWidth: 10,
								font: {
									size: 14
								}
							}
						},
						zoom: {
							zoom: {
								mode: 'x',
								drag: {
									enabled: true,
									borderWidth: 1,
									backgroundColor: 'rgba(225,225,225,0.3)'
								}
							}
						}
					},

					maintainAspectRatio: false
				}
			}}
		/>
	</div>
	<TablePagination
		limit={5}
		rows={phytoSanitaries}
		columns={[
			{ key: 'product', title: 'Producto', value: (v) => v.phytosanitary.name },
			{
				key: 'date',
				title: 'Fecha',
				value: (v) => v.date.split('T')[0]
			},
			{
				key: 'phytoFormula',
				title: 'Formula fitosanitario',
				value: (v) => v.phytosanitary.formula
			},
			{
				key: 'dosage',
				title: 'Dosis',
				value: (v) => v.quantity.toPrecision(5) + ' ' + v.doseUnit
			},
			{
				key: 'plague',
				title: 'Plaga',
				value: (v) => v.plague.name
			}
		]}
	/>
</div>

<style lang="scss">
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
	}
	.chart__header {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
</style>
