<script lang="ts">
	import { page } from '$app/stores';
	import Error from '$lib/components/misc/Error.svelte';
	import Loading from '$lib/components/misc/Loading.svelte';
	import CharacteristicsEnclosure from '$lib/components/panel/CharacteristicsEnclosure.svelte';
	import Crops from '$lib/components/panel/Crops.svelte';
	import CurrentWeather from '$lib/components/panel/CurrentWeather.svelte';
	import MapEnclosure from '$lib/components/panel/MapEnclosure.svelte';
	import Ndvi from '$lib/components/panel/NDVI.svelte';
	import ProtectedAreaCard from '$lib/components/panel/ProtectedAreaCard.svelte';
	import { enclosuresService } from '$lib/config/config';
	import { selectedEnclosure } from '$lib/config/stores/selectedEnclosure';
	// Set enclosure id to store (global state) in memory
	let vulnerableArea = true;
	let id = '';
	$: {
		id = $page.params.id;
		$selectedEnclosure = id;
	}
</script>

<div class="container-responsive">
	<div class="title">
		<h1 class="pb-16">Recinto#{id}</h1>
		{#if vulnerableArea}
			<ProtectedAreaCard />
		{/if}
	</div>
	<div class="overview">
		{#await enclosuresService.getEnclosures([id])}
			<Loading />
		{:then enclosures}
			{@const properties = enclosures[0].properties}
			<MapEnclosure {enclosures} />
			<Crops
				enclosureId={$page.data.id}
				crop={{
					id: properties.cropId,
					name: properties.cropName,
					varietyId: properties.varietyId
				}}
			/>
			<CharacteristicsEnclosure {properties} />
			<Ndvi enclosureId={id} />
			<CurrentWeather enclosureId={id} />
		{:catch error}
			<Error errorMessage={error.message} />
		{/await}
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
			grid-template-rows: 0fr 0.5fr 1fr;
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
