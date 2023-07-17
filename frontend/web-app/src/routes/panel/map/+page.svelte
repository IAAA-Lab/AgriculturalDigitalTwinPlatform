<svelte:options immutable />

<script lang="ts">
	import Map from '$lib/components/panel/Map.svelte';
	import Search from '$lib/components/panel/Search.svelte';
	import SearchPopup from '$lib/components/panel/SearchPopup.svelte';
	import { enclosuresService } from '$lib/config/config';
	import type { Enclosure, NDVI } from '$lib/core/Domain';
	import { TABLET_WIDTH } from '$lib/config/constants';
	import { userEnclosures } from '$lib/config/stores/enclosures';
	import AnalysisEnclosureComp from '$lib/components/panel/AnalysisEnclosureComp.svelte';
	import Filter from '$lib/components/panel/Filter.svelte';

	let mediaQueryMobile = window.matchMedia(`(max-width: ${TABLET_WIDTH}px)`);
	let isInMobile = mediaQueryMobile.matches;

	mediaQueryMobile.addEventListener('change', () => {
		isInMobile = mediaQueryMobile.matches;
	});

	let distance: number;
	let enclosures: Enclosure[] | undefined = undefined;
	let filteredEnclosures: Enclosure[] | undefined = undefined;
	let selectedEnclosure: Enclosure | undefined = undefined;
	// Filter
	let checkedCrops: string[] = [];
	let checkedLocations: string[] = [];
	let orderBy: string | undefined = undefined;
	let limit: number = 0;
	let search: string | undefined = undefined;

	// Client side filtering and ordering of enclosures
	$: {
		filteredEnclosures = enclosures
			?.filter((enclosure) => {
				// Filter by checked crops
				if (checkedCrops.length > 0) {
					return checkedCrops.includes(enclosure.properties.cropName);
				}
				return true;
			})
			.filter((enclosure) => {
				// Filter by checked locations
				if (checkedLocations.length > 0) {
					return checkedLocations.includes(enclosure.properties.geographicSpot);
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

	$: {
		// When a enclosure is not selected, we need to get all the enclosures
		if (!selectedEnclosure) {
			enclosures = $userEnclosures;
			getNDVI($userEnclosures.map((e) => e.id));
		}
	}

	$: {
		// When distance changes, we need to search for the neighbors of the selected enclosure
		if (distance && selectedEnclosure) {
			enclosuresService
				.getEnclosureNeighbors(selectedEnclosure.id, distance)
				.then((enclosuresRes) => {
					enclosures = [...enclosuresRes];
					getNDVI([...enclosuresRes].map((e) => e.id));
					getActivities([...enclosuresRes].map((e) => e.id));
				})
				.catch((err) => {
					enclosures = undefined;
				});
		}
	}

	const getNDVI = (enclosureIds: string[]) => {
		enclosuresService
			.getNDVI(enclosureIds, undefined, undefined, 1)
			.then((res) => {
				enclosures = enclosures?.map((enclosure) => {
					const ndvi = res.find((ndvi) => ndvi.enclosureId === enclosure.id);
					return {
						...enclosure,
						properties: {
							...enclosure.properties,
							ndvi: ndvi
						}
					};
				});
			})
			.catch((err) => {});
	};

	const getActivities = (enclosureIds: string[]) => {
		enclosuresService
			.getActivities(enclosureIds, undefined, undefined, 1)
			.then((res) => {
				enclosures = enclosures?.map((enclosure) => {
					const activities = res.find((activity) => activity.enclosureId === enclosure.id);
					return {
						...enclosure,
						properties: {
							...enclosure.properties,
							activities: activities?.activities
						}
					};
				});
			})
			.catch((err) => {});
	};
</script>

<section class="container-responsive">
	<h1 class="title">Mapa</h1>
	<div class="inner__container__group">
		<Filter {enclosures} bind:checkedCrops bind:checkedLocations bind:orderBy bind:limit />
		<div class="map__analysis__wrapper">
			<Map enclosures={filteredEnclosures} bind:selectedEnclosure bind:distance />
			<AnalysisEnclosureComp listOfEnclosures={filteredEnclosures?.map((e) => e.id)} />
		</div>
		{#if isInMobile}
			<SearchPopup>
				<Search bind:filteredEnclosures bind:selectedEnclosure />
			</SearchPopup>
		{:else}
			<Search bind:filteredEnclosures bind:selectedEnclosure />
		{/if}
	</div>
</section>

<style lang="scss">
	.map__analysis__wrapper {
		display: flex;
		flex-direction: column;
		row-gap: 0.5rem;
		:global(.card) {
			flex: 1;
		}
	}

	.inner__container__group {
		display: grid;
		gap: 0.8rem;
		height: calc(100vh - 6.3rem);
		grid-template-columns: 225px 1fr 400px;
		overflow: hidden;
	}

	@include media('<large') {
		.inner__container__group {
			padding: 0;
			margin-top: 16px;
			grid-template-columns: 1fr;
			height: calc(100vh - 5rem);
		}
	}
</style>
