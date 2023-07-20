<script lang="ts">
	import { IMAGES_SERVER_URL, enclosuresService } from '$lib/config/config';
	import { userEnclosures } from '$lib/config/stores/enclosures';
	import { numberWithCommas, onCropImageError } from '$lib/core/functions';

	export let crop: any | undefined = undefined;
	export let enclosureId: string;
	let stat: any = {};

	$: {
		enclosuresService
			.getCropStats(enclosureId, undefined, undefined)
			.then((statsRes) => {
				stat = statsRes.at(-1) || {};
			})
			.catch((err) => {});
	}

	let enclosure = $userEnclosures.find((e) => e.id === enclosureId);
</script>

<div class="card-inner">
	<img
		src={`${IMAGES_SERVER_URL}/${crop.id}.png`}
		alt={crop.name}
		class="crop__image"
		style="max-width: 50px;"
		on:error={onCropImageError}
	/>
	<h4 class="m-0">{crop?.name?.toUpperCase()}</h4>
	<span class="text-xs fw-700">{crop?.varietyId == 0 ? '---' : crop?.varietyId}</span>
	<div class="crop__divider" />
	<!-- Await -->
	<div class="crop__body__item">
		<i class="fi fi-rr-map-marker" />
		<span class="text-xs m-0"> {numberWithCommas(enclosure?.properties.area)} Ha</span>
	</div>
	<div class="crop__body__item">
		<i class="fi fi-rr-money" />
		<span class="text-xs m-0">
			{numberWithCommas(stat.performance * enclosure.properties.area)} Kg</span
		>
	</div>
	<div class="crop__body__item">
		<i class="fi fi-rr-stats" />
		<span class="text-xs m-0"> {numberWithCommas(stat.performance)} Kg/Ha </span>
	</div>
</div>

<style>
	.card-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		row-gap: 0.5rem;
	}

	.crop__body__item {
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: center;
		column-gap: 0.5rem;
	}

	.crop__divider {
		width: 80%;
		height: 1.75px;
		background: #e3e3e3;
		border-radius: 10px;
	}
</style>
