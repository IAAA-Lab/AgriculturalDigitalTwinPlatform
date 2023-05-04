<script lang="ts">
	import { IMAGES_SERVER_URL } from '$lib/config/config';
	import type { Enclosure } from '$lib/core/Domain';
	import { getColorList, onCropImageError } from '$lib/core/functions';
	import Card from './Card.svelte';
	import MapSearchCard from './MapSearchCard.svelte';

	export let enclosures: Enclosure[] = [];
	const colorList = getColorList(enclosures.length);
	let search = '';
</script>

<Card>
	<h2 class="m-0 mb-8 ml-8" slot="header">Recintos</h2>
	<div slot="body" class="p-8">
		<input type="search" bind:value={search} placeholder="Buscar..." style="width: 100%;" />
		<div class="search-more">
			<span class="text-xs"><strong>{enclosures.length} resultados<strong /></strong></span>
			<div class="filter-order">
				<i class="fi fi-rr-settings-sliders" />
				<i class="fi fi-rr-sort-amount-down-alt" />
			</div>
		</div>
		<br />
		<div class="enclosures">
			{#each enclosures as enclosure, i}
				<a href="/panel/enclosure/{enclosure.id}">
					<MapSearchCard
						location={enclosure.properties.geographicSpot}
						enclosureName={enclosure.id}
						area={enclosure.properties.area}
						geojsonFeature={enclosure}
						color={colorList[i]}
						cropName={enclosure.properties.crop.name}
					>
						<img
							on:error={onCropImageError}
							slot="crops"
							src={`${IMAGES_SERVER_URL}/${enclosure.properties.crop.id}.png`}
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

<style lang="scss">

	:global(.card){
		overflow: scroll;
	}

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
