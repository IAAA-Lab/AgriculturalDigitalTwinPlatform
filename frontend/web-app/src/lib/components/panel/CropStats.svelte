<script lang="ts">
	import CropStatsCard from '$lib/components/panel/CropStatsCard.svelte';
	import { digitalTwinsService } from '$lib/config/config';
	import { userEnclosures } from '$lib/config/stores/enclosures';
	import { formattedTime, numberWithCommas } from '$lib/core/functions';

	export let digitalTwinId: string;

	let enclosure = $userEnclosures.find((enclosure) => enclosure.id === digitalTwinId);

	let cropStats: any = [];
	let cropStatLast: any = {};

	$: {
		digitalTwinsService.getActivities(digitalTwinId, 'harvest').then((data) => {
			cropStats = data;
			cropStatLast = data.at(-1);
		});
	}
</script>

<section>
	<div class="crop__stats__wrapper">
		<CropStatsCard
			title="Producción"
			value={numberWithCommas(
				cropStats.map((cropStat) => cropStat?.yield * enclosure.properties.area).at(-1)
			)}
			unit="Kg"
			diff={numberWithCommas(
				cropStats.map((cropStat) => cropStat?.yield * enclosure.properties.area).at(-1) -
					cropStats.map((cropStat) => cropStat?.yield * enclosure.properties.area).at(-2)
			)}
			datasets={cropStats.map((cropStat) => cropStat?.yield * enclosure.properties.area)}
			labels={cropStats.map((cropStat) => formattedTime(cropStat?.date))}
		/>
		<CropStatsCard
			title="Área"
			value={numberWithCommas(enclosure.properties.area)}
			unit="Ha"
			diff={numberWithCommas(enclosure.properties.area - enclosure.properties.area)}
			datasets={Array.from({ length: cropStats?.length }, () => enclosure.properties.area)}
			labels={cropStats.map((cropStat) => formattedTime(cropStat?.date))}
		/>
		<CropStatsCard
			title="Rendimiento"
			value={numberWithCommas(cropStatLast?.yield)}
			unit="Kg/Ha"
			diff={numberWithCommas(cropStatLast?.yield - cropStats?.at(-2)?.yield)}
			datasets={cropStats.map((cropStat) => cropStat?.yield)}
			labels={cropStats.map((cropStat) => formattedTime(cropStat?.date))}
		/>
	</div>
</section>

<style lang="scss">
	section {
		grid-area: crop-stats;
	}
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
