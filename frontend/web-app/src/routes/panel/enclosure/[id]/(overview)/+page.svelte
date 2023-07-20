<script lang="ts">
	import { page } from '$app/stores';
	import CharacteristicsEnclosure from '$lib/components/panel/CharacteristicsEnclosure.svelte';
	import Crops from '$lib/components/panel/Crops.svelte';
	import CurrentWeather from '$lib/components/panel/CurrentWeather.svelte';
	import MapEnclosure from '$lib/components/panel/MapEnclosure.svelte';
	import Ndvi from '$lib/components/panel/NDVI.svelte';
	import ProtectedAreaCard from '$lib/components/panel/ProtectedAreaCard.svelte';
	import { selectedEnclosure, userEnclosures } from '$lib/config/stores/enclosures';
	import type { Enclosure } from '$lib/core/Domain';

	let id = '';
	let enclosure: Enclosure | undefined = undefined;

	$: {
		id = $page.params.id;
		enclosure = $userEnclosures?.find((e) => e.id === id);
		$selectedEnclosure = id;
	}
</script>

<div class="container">
	<div class="title">
		<h1 class="pb-16">Recinto#{id}</h1>
		{#if enclosure?.properties?.vulnerableArea}
			<ProtectedAreaCard />
		{/if}
	</div>
	<div class="overview">
		<MapEnclosure enclosures={!enclosure ? [] : [enclosure]} />
		<Crops
			enclosureId={id}
			crop={{
				id: enclosure?.properties?.cropId,
				name: enclosure?.properties?.cropName,
				varietyId: enclosure?.properties?.varietyId
			}}
		/>
		<CharacteristicsEnclosure properties={enclosure?.properties} />
		<Ndvi enclosureId={id} />
		<CurrentWeather enclosureId={id} />
	</div>
</div>

<style lang="scss">
	.title {
		display: flex;
		flex-direction: row;
		align-items: center;
		column-gap: 1rem;
		flex-wrap: wrap-reverse;
	}
	.overview {
		display: grid;
		gap: 0.75rem;
		grid-template-areas:
			'map'
			'crops'
			'characteristics'
			'ndvi'
			'weather';

		.weather {
			display: none;
		}
	}

	@include media('>large') {
		.overview {
			grid-template-columns: 1.5fr 0.7fr 0.9fr;
			grid-template-rows: 0fr auto 1fr;
			grid-template-areas:
				'map characteristics characteristics'
				'map crops weather'
				'ndvi ndvi weather';

			:global(.summary) {
				display: block;
			}
		}
	}
</style>
