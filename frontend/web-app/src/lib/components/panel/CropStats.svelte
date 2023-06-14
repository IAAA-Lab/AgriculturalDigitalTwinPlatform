<script lang="ts">
	import Error from '$lib/components/misc/Error.svelte';
	import Loading from '$lib/components/misc/Loading.svelte';
	import Card from '$lib/components/panel/Card.svelte';
	import Chart from '$lib/components/panel/Chart.svelte';
	import CropStatsCard from '$lib/components/panel/CropStatsCard.svelte';
	import { enclosuresService } from '$lib/config/config';

	let selectedCropStat: any = {};
	export let enclosureId: string;
</script>

<section>
	<div class="crop__stats__wrapper">
		{#await enclosuresService.getCropStats(enclosureId, undefined, undefined)}
			<Loading />
		{:then cropStats}
			{@const cropStatsOrdered = cropStats.sort(
				(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
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
				value={cropStatLast.production}
				unit="Kg"
				diff={cropStatLast.production - cropStats.at(-2).production}
				datasets={cropStatsOrdered.map((cropStat) => cropStat.production)}
				labels={cropStatsOrdered.map((cropStat) => cropStat.date)}
				primary={selectedCropStat.title === ''}
			/>
			<CropStatsCard
				title="Área"
				value={cropStatLast.area}
				unit="Ha"
				diff={cropStatLast.area - cropStats.at(-2).area}
				datasets={cropStatsOrdered.map((cropStat) => cropStat.area)}
				labels={cropStatsOrdered.map((cropStat) => cropStat.date)}
				primary={selectedCropStat.title === ''}
			/>
			<CropStatsCard
				title="Cosecha"
				value={cropStatLast.harvest}
				diff={cropStatLast.harvest - cropStats.at(-2).harvest}
				datasets={cropStatsOrdered.map((cropStat) => cropStat.harvest)}
				labels={cropStatsOrdered.map((cropStat) => cropStat.date)}
				primary={selectedCropStat.title === ''}
			/>
			<CropStatsCard
				title="Rendimiento"
				value={cropStatLast.performance}
				unit="Kg/Ha"
				diff={cropStatLast.performance - cropStats.at(-2).performance}
				datasets={cropStatsOrdered.map((cropStat) => cropStat.performance)}
				labels={cropStatsOrdered.map((cropStat) => cropStat.date)}
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

<style>
	.crop__stats__wrapper {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
	}

	.chart {
		height: 300px;
	}

	button {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
	}
</style>
