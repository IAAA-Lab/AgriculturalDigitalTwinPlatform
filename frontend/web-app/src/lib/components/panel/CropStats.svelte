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
		{#await enclosuresService.getCropStats(enclosureId)}
			<Loading />
		{:then cropStats}
			{#each cropStats as cropStat}
				<button on:click={() => (selectedCropStat = cropStat)}>
					<CropStatsCard
						title={cropStat.title}
						value={cropStat.value}
						unit={cropStat.unit}
						diff={cropStat.diff}
						datasets={cropStat.datasets}
						labels={cropStat.labels}
						primary={selectedCropStat.title === cropStat.title}
					/>
				</button>
			{/each}
		{:catch}
			<Error />
		{/await}
	</div>
	<br />
	<Card>
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
	</Card>
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
