<script lang="ts">
	import Error from '$lib/components/misc/Error.svelte';
	import Loading from '$lib/components/misc/Loading.svelte';
	import CropStatsCard from '$lib/components/panel/CropStatsCard.svelte';
	import { enclosuresService } from '$lib/config/config';
	import { userEnclosures } from '$lib/config/stores/enclosures';
	import { formattedTime, numberWithCommas } from '$lib/core/functions';
	import { onMount } from 'svelte';

	let selectedCropStat: any = {};
	export let enclosureId: string;

	let enclosure = $userEnclosures.find((enclosure) => enclosure.id === enclosureId);

	let cropStats: any = [];
	let cropStatLast: any = {};

	onMount(() => {
		enclosuresService.getCropStats(enclosureId, undefined, undefined).then((res) => {
			const cropStatsRes = res.sort((a, b) => a.harvestDate - b.harvestDate);
			cropStats = cropStatsRes;
			cropStatLast = cropStatsRes.at(-1);
		});
	});
</script>

<section>
	<div class="crop__stats__wrapper">
		<!-- <button on:click={() => (selectedCropStat = cropStat)}> -->
		<CropStatsCard
			title="Producción"
			value={numberWithCommas(
				cropStats.map((cropStat) => cropStat?.performance * enclosure.properties.area).at(-1)
			)}
			unit="Kg"
			diff={numberWithCommas(
				cropStats.map((cropStat) => cropStat?.performance * enclosure.properties.area).at(-1) -
					cropStats.map((cropStat) => cropStat?.performance * enclosure.properties.area).at(-2)
			)}
			datasets={cropStats.map((cropStat) => cropStat?.performance * enclosure.properties.area)}
			labels={cropStats.map((cropStat) => formattedTime(cropStat?.harvestDate))}
			primary={selectedCropStat.title === ''}
		/>
		<CropStatsCard
			title="Área"
			value={numberWithCommas(cropStatLast?.area)}
			unit="Ha"
			diff={numberWithCommas(cropStatLast?.area - cropStats?.at(-2)?.area)}
			datasets={Array.from({ length: cropStats?.length }, () => enclosure.properties.area)}
			labels={cropStats.map((cropStat) => formattedTime(cropStat?.harvestDate))}
			primary={selectedCropStat.title === ''}
		/>
		<CropStatsCard
			title="Rendimiento"
			value={numberWithCommas(cropStatLast?.performance)}
			unit="Kg/Ha"
			diff={numberWithCommas(cropStatLast?.performance - cropStats?.at(-2)?.performance)}
			datasets={cropStats.map((cropStat) => cropStat?.performance)}
			labels={cropStats.map((cropStat) => formattedTime(cropStat?.harvestDate))}
			primary={selectedCropStat.title === ''}
		/>
	</div>
	<br />
	<!-- <Card>
		<div slot="body" class="chart">
			<Chart
				data={{
					data: {
						datasets: [
							{
								label: '',
								data: selectedCropStat.datasets,
								fill: true,
								backgroundColor: function (context) {
									const chart = context.chart;
									const { ctx, chartArea } = chart;
									if (!chartArea) {
										return null;
									}
									const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
									gradient.addColorStop(0, 'rgba(255,255,255,0.7)');
									gradient.addColorStop(0.6, 'rgba(252, 155, 104,1)');
									return gradient;
								},
								borderWidth: 3,
								borderColor: '#414242',
								tension: 0.2
							}
						]
					}
				}}
			/>
		</div>
	</Card> -->
</section>

<style lang="scss">
	.crop__stats__wrapper {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
	}

	button {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
	}

	@include media('<medium') {
		.crop__stats__wrapper {
			display: flex;
			flex-direction: column;
		}
	}
</style>
