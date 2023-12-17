<script lang="ts">
	import type { Enclosure } from '$lib/core/Domain';
	import AnalysisYearCompChart from './AnalysisYearCompChart.svelte';
	import MapInd from './MapInd.svelte';

	let selectedDate: string | undefined = new Date(new Date().setDate(new Date().getDate() - 3))
		.toISOString()
		.split('T')[0];
	export let enclosure: Enclosure;
</script>

<div class="wrapper">
	<MapInd {enclosure} endDate={selectedDate} />
	<div class="card">
		<AnalysisYearCompChart
			bind:selectedDate
			enclosures={[enclosure.id]}
			endDate={new Date().toISOString().split('T')[0]}
			startDate={new Date(new Date().setDate(new Date().getDate() - 30 * 13))
				.toISOString()
				.split('T')[0]}
			idema={enclosure?.meteoStation.idema}
		/>
	</div>
</div>

<style>
	.wrapper {
		grid-area: ndvi;
		width: 100%;
		display: flex;
		flex-direction: row;
		column-gap: 0.5rem;
		height: 455px;
	}
	.card {
		min-width: 200px;
		flex: 1;
		height: 100%;
	}
</style>
