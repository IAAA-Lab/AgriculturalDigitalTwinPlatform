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
	let orderBy: string | undefined = undefined;
	let limit: number = 0;
	let openFilterDialog = false;

	// Client side filtering and ordering of enclosures
	$: {
		filteredEnclosures = enclosures
			.filter((enclosure) => {
				if (selectedCrop && selectedLocation) {
					return (
						enclosure.properties.cropName === selectedCrop &&
						enclosure.properties.geographicSpot === selectedLocation
					);
				} else if (selectedCrop) {
					return enclosure.properties.cropName === selectedCrop;
				} else if (selectedLocation) {
					return enclosure.properties.geographicSpot === selectedLocation;
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
			})
			.sort((a, b) => {
				switch (orderBy) {
					case 'area':
						return b.properties.area - a.properties.area;
					case 'crop':
						return a.properties.cropName.localeCompare(b.properties.cropName);
					case 'location':
						return a.properties.geographicSpot.localeCompare(b.properties.geographicSpot);
					case 'ndviAsc':
						if (!a.properties.ndvi || !b.properties.ndvi) {
							return 0;
						}
						return a.properties.ndvi.ndvi[0].value - b.properties.ndvi.ndvi[0].value;
					case 'ndviDesc':
						if (!a.properties.ndvi || !b.properties.ndvi) {
							return 0;
						}
						return b.properties.ndvi.ndvi[0].value - a.properties.ndvi.ndvi[0].value;
					default:
						return 0;
				}
			})
			.slice(0, limit === 0 ? enclosures.length : limit);
	}

	const selectEnclosure = (enclosure: Enclosure) => {
		selectedEnclosure = { ...enclosure };
		$mapStore.flyToCoords(enclosure.geometry.coordinates[0]);
	};
</script>

<div style="overflow-y: scroll; position: relative;">
	<FilterDialog
		bind:open={openFilterDialog}
		{enclosures}
		bind:selectedCrop
		bind:selectedLocation
		bind:orderBy
		bind:limit
	/>
	<Card>
		<h2 class="m-0 mb-8 ml-8" slot="header">Recintos</h2>
		<div slot="body" class="p-8">
			<input type="search" bind:value={search} placeholder="Buscar..." style="width: 100%;" />
			<div class="search-more">
				<span class="text-xs"
					><strong>{filteredEnclosures.length} resultados<strong /></strong></span
				>
				<button on:click={() => (openFilterDialog = !openFilterDialog)}>
					<i class="fi fi-rr-settings-sliders" />
				</button>
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
							color={!selectedEnclosure
								? getColor(i)
								: selectedEnclosure.id === enclosure.id
								? 'red'
								: 'grey'}
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
</style>
