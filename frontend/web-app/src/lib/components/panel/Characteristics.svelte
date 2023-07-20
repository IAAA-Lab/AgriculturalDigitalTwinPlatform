<script lang="ts">
	import type { Enclosure } from '$lib/core/Domain';
	import { getColor, getIconByCharacteristic } from '$lib/core/functions';
	import Chart from './Chart.svelte';
	import StatsCard from './StatsCard.svelte';

	export let enclosures: Enclosure[] = [];
	let uniqueCrops: string[] = [];
	let countCrops: number[] = [];
	// Average properties
	let characteristics: any = [];
	let properties = {
		area: 0,
		areaSIGPAC: 0,
		irrigationCoef: 0,
		slope: 0
	};
	$: {
		if (enclosures) {
			properties = {
				area: enclosures.reduce((a, b) => a + b.properties.area, 0),
				areaSIGPAC: enclosures.reduce((a, b) => a + b.properties.areaSIGPAC, 0),
				irrigationCoef:
					enclosures.reduce((a, b) => a + b.properties.irrigationCoef, 0) / enclosures.length,
				slope: enclosures.reduce((a, b) => a + b.properties.slope, 0) / enclosures.length
			};

			characteristics = [
				{
					name: 'Área total',
					value: properties.area,
					unit: 'Ha'
				},
				{
					name: 'Área SIGPAC',
					value: properties.areaSIGPAC,
					unit: 'Ha'
				},
				{
					name: 'Coef. regadío medio',
					value: properties.irrigationCoef,
					unit: '%'
				},
				{
					name: 'Pendiente media',
					value: properties.slope,
					unit: '%'
				}
			];

			uniqueCrops = [
				...new Set(
					enclosures
						.map((enclosure) => enclosure.properties.cropName)
						.filter((crop) => crop.length > 0)
				)
			];

			// Show the quantity of each plant in enclosures
			countCrops = uniqueCrops.map(
				(c) => enclosures.filter((e) => e.properties.cropName === c).length
			);
		}
	}
</script>

<section>
	<h2 class="m-0 pt-8">Recintos del usuario</h2>
	<span class="m-0 mb-16">Promedio de características</span>
	<div class="characteristics">
		{#each characteristics as characteristic}
			<div class="characteristic-item">
				<StatsCard
					statName={characteristic.name}
					statValue={characteristic.value}
					statUnit={characteristic.unit}
				>
					{@html getIconByCharacteristic(characteristic)}
				</StatsCard>
			</div>
		{/each}
	</div>
	<div class="dynamic__characteristics mt-16 card">
		<h4 class="m-0 mb-8">Plantas por recinto</h4>
		<div class="chart__wrapper">
			<Chart
				data={{
					type: 'doughnut',
					data: {
						datasets: [
							{
								data: countCrops,
								backgroundColor: countCrops.map((_, i) => `${getColor(i)}9C`),
								borderColor: countCrops.map((_, i) => getColor(i)),
								borderWidth: 1
							}
						],
						labels: uniqueCrops.map((c) => (c === '' ? 'N/A' : c))
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
</section>

<style lang="scss">
	section {
		grid-area: characteristics;
		word-break: break-all;
		word-wrap: break-word;

		.characteristics {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			gap: 0.5rem;
			.characteristic-item {
				flex: 200px;
			}
		}

		.range {
			display: flex;
			align-items: center;
			justify-content: space-between;
			white-space: nowrap;
		}

		.dynamic__characteristics {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;

			.chart__wrapper {
				max-height: 200px;
			}
		}
	}
</style>
