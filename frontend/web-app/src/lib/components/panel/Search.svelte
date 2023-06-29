<script lang="ts">
	import { IMAGES_SERVER_URL } from '$lib/config/config';
	import type { Enclosure } from '$lib/core/Domain';
	import { getColor, onCropImageError } from '$lib/core/functions';
	import mapStore from '../../../routes/panel/map/store';
	import Card from './Card.svelte';
	import MapSearchCard from './MapSearchCard.svelte';

	export let enclosures: Enclosure[] = [];
	export let filteredEnclosures: Enclosure[] = [];
	export let selectedEnclosure: Enclosure | undefined = undefined;
	let search = '';

	$: {
		filteredEnclosures = enclosures.filter((enclosure) => {
			const cropName = enclosure.properties.cropName.toLowerCase();
			const geographicSpot = enclosure.properties.geographicSpot.toLowerCase();
			const id = enclosure.id.toLowerCase();
			return (
				cropName.includes(search.toLowerCase()) ||
				geographicSpot.includes(search.toLowerCase()) ||
				id.includes(search.toLowerCase())
			);
		});
	}

	const selectEnclosure = (enclosure: Enclosure) => {
		$mapStore.flyToCoords(enclosure.geometry.coordinates[0]);
		selectedEnclosure = { ...enclosure };
	};
</script>

<div style="overflow-y: scroll">
	<Card>
		<h2 class="m-0 mb-8 ml-8" slot="header">Recintos</h2>
		<div slot="body" class="p-8">
			<input type="search" bind:value={search} placeholder="Buscar..." style="width: 100%;" />
			<div class="search-more">
				<span class="text-xs"
					><strong>{filteredEnclosures.length} resultados<strong /></strong></span
				>
				<div class="filter-order">
					<i class="fi fi-rr-settings-sliders" />
					<i class="fi fi-rr-sort-amount-down-alt" />
				</div>
			</div>
			<br />
			<div class="enclosures">
				{#each filteredEnclosures as enclosure, i}
					<a on:click={() => selectEnclosure(enclosure)} href="#">
						<MapSearchCard
							location={enclosure.properties.geographicSpot}
							enclosureName={enclosure.id}
							area={enclosure.properties.area}
							geojsonFeature={enclosure}
							color={getColor(i)}
							cropName={enclosure.properties.cropName}
							ndvi={enclosure.properties.ndvi}
							enclosureId={enclosure.id}
						>
							<img
								on:error={onCropImageError}
								slot="crops"
								src={`${IMAGES_SERVER_URL}/${enclosure.properties.cropId}.png`}
								alt="img planta"
								height="30"
								class="ml-8"
							/>
						</MapSearchCard>
					</a>
				{/each}
			</div>
		</div>
	</Card>
</div>

<style lang="scss">
	.enclosures {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		padding-left: 5px;
		padding-right: 5px;
	}

	.search-more {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding-left: 8px;
		padding-right: 8px;
	}
	.filter-order {
		margin-top: 8px;
		display: flex;
		flex-direction: row;
		gap: 1rem;
		cursor: pointer;
	}
</style>
