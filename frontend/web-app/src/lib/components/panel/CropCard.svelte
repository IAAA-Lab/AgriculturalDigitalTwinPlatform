<script lang="ts">
	import { IMAGES_SERVER_URL, enclosuresService } from '$lib/config/config';
	import { userEnclosures } from '$lib/config/stores/enclosures';
	import { numberWithCommas, onCropImageError } from '$lib/core/functions';
	import Error from '../misc/Error.svelte';
	import Loading from '../misc/Loading.svelte';
	import CardInner from './CardInner.svelte';

	export let crop: any;
	export let enclosureId: string;

	let enclosure = $userEnclosures.find((e) => e.id === enclosureId);
</script>

<CardInner>
	<div slot="body" class="crop">
		{#await enclosuresService.getCropStats(enclosureId, undefined, undefined)}
			<Loading />
		{:then stats}
			{@const stat = stats.at(-1) || {
				production: '--',
				area: '--',
				plantation: '--',
				date: '--'
			}}
			<div class="crop__header">
				<img
					src={`${IMAGES_SERVER_URL}/${crop.id}.png`}
					alt={crop.name}
					class="crop__image"
					style="max-width: 50px;"
					on:error={onCropImageError}
				/>
				<h4 class="m-0">{crop.name.toUpperCase()}</h4>
				<span class="text-xs fw-700">{crop.varietyId == 0 ? '---' : crop.varietyId}</span>
				<!-- <span class="text-xxs">{formattedTime(stat?.harvestDate)}</span> -->
			</div>
			<div class="crop__divider" />
			<!-- Await -->
			<div class="crop__body">
				<div class="crop__body__item">
					<i class="fi fi-rr-map-marker" />
					<span class="text-xs m-0"> {numberWithCommas(enclosure.properties.area)} Ha</span>
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
				<!-- <div class="crop__body__item">
					<i class="fi fi-rr-hand-holding-seeding" />
					<span class="text-xs m-0"> {stat.harvest} cosechadas</span>
				</div> -->
			</div>
		{:catch error}
			<Error errorMessage={error.message} />
		{/await}
	</div>
</CardInner>

<style>
	.crop {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		row-gap: 0.5rem;
	}
	.crop__header {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		row-gap: 0.25rem;
		text-transform: uppercase;
	}

	.crop__body {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		row-gap: 0.2rem;
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
