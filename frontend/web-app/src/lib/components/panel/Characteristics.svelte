<script lang="ts">
	import type { Enclosure } from '$lib/core/Domain';
	import { getColorList, getIconByCharacteristic } from '$lib/core/functions';
	import Card from './Card.svelte';
	import Chart from './Chart.svelte';
	import StatsCard from './StatsCard.svelte';

	export let enclosures: Enclosure[] = [];
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
		}
		if (enclosures) {
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
		}
	}
</script>

<section>
	<h2 class="m-0 pt-16">Recintos del usuario</h2>
	<summary class="text-sm m-0 mb-8">Promedio de características</summary>
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
	<br />
	<div class="dynamic__characteristics">
		<!-- <Card>
      <h4 slot="header" class="m-0 mb-8 text-sm">
        Salud de las plantas (NDVI)
      </h4>
      <div slot="body" class="range">
        <Range value={0.1} to={1} background={getRangeBarColor(0.1)} />
        <span class="text-sm fw-700 ml-8">{0.1}</span>
      </div>
    </Card> -->
		<Card>
			<h4 slot="header" class="m-0 mb-8 text-sm">Plantas por recinto</h4>
			<div slot="body">
				<!-- SHow the quantity of each plant in enclosures -->
				{@const uniqueCrops = [...new Set(enclosures.map((e) => e.properties.cropName))]}
				{@const countCrops = uniqueCrops.map(
					(c) => enclosures.filter((e) => e.properties.cropName === c).length
				)}
				<!-- Convert spaces in N/A -->
				{@const labels = uniqueCrops.map((c) => (c === '' ? 'N/A' : c))}
				<div class="chart__wrapper">
					<Chart
						data={{
							type: 'doughnut',
							data: {
								datasets: [
									{
										data: countCrops,
										backgroundColor: getColorList(countCrops.length).map((c) => `${c}9C`),
										borderColor: getColorList(countCrops.length),
										borderWidth: 1
									}
								],
								labels
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
		</Card>
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
