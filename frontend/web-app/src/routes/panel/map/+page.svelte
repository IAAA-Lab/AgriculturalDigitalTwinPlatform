<svelte:options immutable />

<script lang="ts">
	import Map from '$lib/components/panel/Map.svelte';
	import Search from '$lib/components/panel/Search.svelte';
	import SearchPopup from '$lib/components/panel/SearchPopup.svelte';
	import { enclosuresService } from '$lib/config/config';
	import type { Enclosure, NDVI } from '$lib/core/Domain';
	import { TABLET_WIDTH } from '$lib/config/constants';
	import { listOfEnclosures } from '$lib/config/stores/selectedEnclosure';

	let mediaQueryMobile = window.matchMedia(`(max-width: ${TABLET_WIDTH}px)`);
	let isInMobile = mediaQueryMobile.matches;

	mediaQueryMobile.addEventListener('change', () => {
		isInMobile = mediaQueryMobile.matches;
	});

	let distance: number;
	let enclosures: Enclosure[] | undefined = undefined;
	let filteredEnclosures: Enclosure[] | undefined = undefined;
	let selectedEnclosure: Enclosure | undefined = undefined;

	$: {
		// When a enclosure is not selected, we need to get all the enclosures
		if (!selectedEnclosure) {
			enclosuresService
				.getEnclosures($listOfEnclosures)
				.then((enclosuresRes) => {
					enclosures = [...enclosuresRes];
					getNDVI([...enclosuresRes].map((e) => e.id));
				})
				.catch((err) => {
					enclosures = undefined;
				});
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
	<div class="inner__container">
		<Map enclosures={filteredEnclosures} bind:selectedEnclosure bind:distance />
		{#if isInMobile}
			<SearchPopup>
				<Search bind:filteredEnclosures {enclosures} bind:selectedEnclosure />
			</SearchPopup>
		{:else}
			<Search bind:filteredEnclosures {enclosures} bind:selectedEnclosure />
		{/if}
	</div>
</section>

<style lang="scss">
	section {
		overflow-y: scroll;
	}
	.inner__container {
		display: grid;
		gap: 0.8rem;
		height: calc(100vh - 6.3rem);
		grid-template-columns: 1fr 400px;
	}

	@include media('<large') {
		.inner__container {
			padding: 0;
			margin-top: 16px;
			grid-template-columns: 1fr;
			height: calc(100vh - 5rem);
		}
	}
</style>
