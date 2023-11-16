<script lang="ts">
	import { IMAGES_SERVER_URL } from '$lib/config/config';
	import type { Enclosure } from '$lib/core/Domain';
	import { getColor, onCropImageError } from '$lib/core/functions';
	import { onMount } from 'svelte';
	import mapStore from '../../../routes/panel/map/store';
	import MapSearchCard from './MapSearchCard.svelte';

	export let filteredEnclosures: Enclosure[] = [];
	export let selectedEnclosure: Enclosure | undefined = undefined;
	export let search: string | undefined = undefined;

	const selectEnclosure = (enclosure: Enclosure) => {
		selectedEnclosure = { ...enclosure };
		$mapStore.flyToCoords(enclosure.geometry.coordinates[0]);
	};
</script>

<div class="p-8 card">
	<input type="search" bind:value={search} placeholder="Buscar..." style="width: 100%;" />
	<span class="text-xs"><strong>{filteredEnclosures.length} resultados<strong /></strong></span>
	<div id="enclosures" class="enclosures mt-16">
		{#each filteredEnclosures as enclosure, i}
			<a on:click={() => selectEnclosure(enclosure)} href="#">
				<MapSearchCard
					location={`${enclosure.location.ccaa}, ${enclosure.location.province}`}
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

<style lang="scss">
	.enclosures {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		padding: 0 5px;
		overflow-y: scroll;
		height: calc(100% - 4.3rem);
	}
</style>
