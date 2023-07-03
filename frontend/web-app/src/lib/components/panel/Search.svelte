<script lang="ts">
	import { IMAGES_SERVER_URL } from '$lib/config/config';
	import type { Enclosure } from '$lib/core/Domain';
	import { getColor, onCropImageError } from '$lib/core/functions';
	import mapStore from '../../../routes/panel/map/store';
	import Card from './Card.svelte';
	import FilterDialog from './FilterDialog.svelte';
	import MapSearchCard from './MapSearchCard.svelte';

	export let enclosures: Enclosure[] = [];
	export let filteredEnclosures: Enclosure[] = [];
	export let selectedEnclosure: Enclosure | undefined = undefined;
	let search: string | undefined = undefined;
	let selectedCrop: string | undefined = undefined;
	let selectedLocation: string | undefined = undefined;
	let openFilterDialog = false;

	$: {
		filteredEnclosures = enclosures
			.filter((enclosure) => {
				// Filter by selected crop and location
				if (selectedCrop || selectedLocation) {
					return (
						enclosure.properties.cropName === selectedCrop ||
						enclosure.properties.geographicSpot === selectedLocation
					);
				}
				return true;
			})
			.filter((enclosure) => {
				// Filter by search
				if (search) {
					return (
						enclosure.id.toLowerCase().includes(search.toLowerCase()) ||
						enclosure.properties.cropName.toLowerCase().includes(search.toLowerCase()) ||
						enclosure.properties.geographicSpot.toLowerCase().includes(search.toLowerCase())
					);
				}
				return true;
			});
	}

	const selectEnclosure = (enclosure: Enclosure) => {
		selectedEnclosure = { ...enclosure };
		$mapStore.flyToCoords(enclosure.geometry.coordinates[0]);
	};
</script>

<div style="overflow-y: scroll; position: relative;">
	<FilterDialog bind:open={openFilterDialog} {enclosures} bind:selectedCrop bind:selectedLocation />
	<Card>
		<h2 class="m-0 mb-8 ml-8" slot="header">Recintos</h2>
		<div slot="body" class="p-8">
			<input type="search" bind:value={search} placeholder="Buscar..." style="width: 100%;" />
			<div class="search-more">
				<span class="text-xs"
					><strong>{filteredEnclosures.length} resultados<strong /></strong></span
				>
				<div class="filter-order">
					<button on:click={() => (openFilterDialog = !openFilterDialog)}>
						<i class="fi fi-rr-settings-sliders" />
					</button>
					<button on:click={() => {}}>
						<i class="fi fi-rr-sort-amount-down-alt" />
					</button>
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
							color={selectedEnclosure
								? 'grey'
								: selectedEnclosure?.id === enclosure.id
								? 'red'
								: getColor(i)}
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
