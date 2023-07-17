<script lang="ts">
	import Error from '$lib/components/misc/Error.svelte';
	import Loading from '$lib/components/misc/Loading.svelte';
	import CropStatsCard from '$lib/components/panel/CropStatsCard.svelte';
	import { enclosuresService } from '$lib/config/config';
	import { userEnclosures } from '$lib/config/stores/enclosures';
	import { formattedTime, numberWithCommas } from '$lib/core/functions';

	let selectedCropStat: any = {};
	export let enclosureId: string;

	let enclosure = $userEnclosures.find((enclosure) => enclosure.id === enclosureId);
</script>

<section>
	<div class="crop__stats__wrapper">
		{#await enclosuresService.getCropStats(enclosureId, undefined, undefined)}
			<Loading />
		{:then cropStats}
			{@const cropStatsOrdered = cropStats.sort(
				(a, b) => new Date(a.harvestDate).getTime() - new Date(b.harvestDate).getTime()
			)}
			{@const cropStatLast = cropStatsOrdered.at(-1) || {
				production: '--',
				area: '--',
				harvest: '--',
				plantation: '--',
				date: '--'
			}}
			<!-- <button on:click={() => (selectedCropStat = cropStat)}> -->
			<CropStatsCard
				title="Producción"
				value={numberWithCommas(
					cropStatsOrdered
						.map((cropStat) => cropStat.performance * enclosure.properties.area)
						.at(-1)
				)}
				unit="Kg"
				diff={numberWithCommas(
					cropStatsOrdered
						.map((cropStat) => cropStat.performance * enclosure.properties.area)
						.at(-1) -
						cropStatsOrdered
							.map((cropStat) => cropStat.performance * enclosure.properties.area)
							.at(-2)
				)}
				datasets={cropStatsOrdered.map(
					(cropStat) => cropStat.performance * enclosure.properties.area
				)}
				labels={cropStatsOrdered.map((cropStat) => formattedTime(cropStat.harvestDate))}
				primary={selectedCropStat.title === ''}
			/>
			<CropStatsCard
				title="Área"
				value={numberWithCommas(cropStatLast.area)}
				unit="Ha"
				diff={numberWithCommas(cropStatLast.area - cropStats.at(-2).area)}
				datasets={Array.from({ length: cropStatsOrdered.length }, () => enclosure.properties.area)}
				labels={cropStatsOrdered.map((cropStat) => formattedTime(cropStat.harvestDate))}
				primary={selectedCropStat.title === ''}
			/>
			<!-- <CropStatsCard
				title="Cosecha"
				value={numberWithCommas(cropStatLast.harvest)}
				diff={numberWithCommas(cropStatLast.harvest - cropStats.at(-2).harvest)}
				datasets={cropStatsOrdered.map((cropStat) => cropStat.harvest)}
				labels={cropStatsOrdered.map((cropStat) => cropStat.date)}
				primary={selectedCropStat.title === ''}
			/> -->
			<CropStatsCard
				title="Rendimiento"
				value={numberWithCommas(cropStatLast.performance)}
				unit="Kg/Ha"
				diff={numberWithCommas(cropStatLast.performance - cropStats.at(-2).performance)}
				datasets={cropStatsOrdered.map((cropStat) => cropStat.performance)}
				labels={cropStatsOrdered.map((cropStat) => formattedTime(cropStat.harvestDate))}
				primary={selectedCropStat.title === ''}
			/>
			<!-- </button> -->
		{:catch}
			<Error />
		{/await}
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
