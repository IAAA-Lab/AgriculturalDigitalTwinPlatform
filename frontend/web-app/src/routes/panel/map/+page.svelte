<svelte:options immutable />

<script lang="ts">
	import Map from '$lib/components/panel/Map.svelte';
	import { enclosuresService } from '$lib/config/config';
	import type { Enclosure, NDVI } from '$lib/core/Domain';
	import { userEnclosures } from '$lib/config/stores/enclosures';
	import AnalysisEnclosureComp from '$lib/components/panel/AnalysisEnclosureComp.svelte';
	import Filter from '$lib/components/panel/Filter.svelte';

	let distance: number;
	let enclosures: Enclosure[] | undefined = undefined;
	let filteredEnclosures: Enclosure[] | undefined = undefined;
	let selectedEnclosure: Enclosure | undefined = undefined;
	// Filter
	let checkedCrops: string[] = [];
	let checkedLocations: string[] = [];
	let checkedProvinces: string[] = [];
	let checkedCCAA: string[] = [];
	let orderBy: string | undefined = undefined;
	let limit: number = 0;
	let search: string | undefined = undefined;
	// Dialogs
	let showFilters = false;
	let showAnalysis = false;
	let analysisCollapsed = false;

	// Client side filtering and ordering of enclosures
	$: {
		limit = 0;
		filteredEnclosures = enclosures
			?.filter((enclosure) => {
				// Filter by checked crops
				if (checkedCrops.length > 0) {
					return checkedCrops.includes(enclosure.properties.cropName);
				}
				return true;
			})
			.filter((enclosure) => {
				// Filter by checked provinces
				if (checkedProvinces.length > 0) {
					return checkedProvinces.includes(enclosure.location.province);
				}
				return true;
			})
			.filter((enclosure) => {
				// Filter by checked CCAA
				if (checkedCCAA.length > 0) {
					return checkedCCAA.includes(enclosure.location.ccaa);
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
			.slice(0, 10);
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

	// let enclosuresElement: HTMLElement | null = null;

	// onMount(() => {
	// 	enclosuresElement = document.getElementById('enclosures');
	// 	if (!enclosuresElement) return;
	// 	enclosuresElement.onscroll = () => {
	// 		// when scroll reaches the bottom of the element "enclosures", we load more enclosures
	// 		const { scrollTop, scrollHeight, clientHeight } = enclosuresElement;
	// 		if (scrollTop + clientHeight >= scrollHeight - 5) {
	// 			limit += 10;
	// 			// if (filteredEnclosures?.length === enclosures?.length) return;
	// 			filteredEnclosures = [...filteredEnclosures, ...enclosures?.slice(limit, limit + 10)];
	// 		}
	// 	};
	// });

	// onDestroy(() => {
	// 	enclosuresElement?.removeEventListener('scroll', () => {});
	// });
</script>

<section class="container-responsive">
	<div class="header">
		<h1 class="title mt-0">Mapa</h1>
		<i
			class="fi fi-rr-settings-sliders"
			on:click={() => {
				showFilters = !showFilters;
				showAnalysis = false;
			}}
		/>
		<i
			class="fi fi-rr-chart-simple"
			on:click={() => {
				showAnalysis = !showAnalysis;
				showFilters = false;
			}}
		/>
	</div>
	<div class="inner__container__group">
		<div class="card">
			<Filter />
		</div>
		<div class="map__analysis__wrapper">
			<Map bind:enclosures={filteredEnclosures} bind:selectedEnclosure bind:distance />
			<div class="card analysis" class:collapsed={analysisCollapsed}>
				<button
					class="button-xs button-secondary dropdown__close"
					on:click={() => (analysisCollapsed = !analysisCollapsed)}
				>
					<i class="fi fi-rr-angle-down" />
				</button>
				<AnalysisEnclosureComp listOfEnclosures={filteredEnclosures?.map((e) => e.id)} />
			</div>
		</div>
		<!-- <Search bind:filteredEnclosures bind:selectedEnclosure bind:search /> -->
	</div>
</section>

<style lang="scss">
	section {
		padding: 0 !important;
	}

	.analysis {
		position: relative;
		max-height: 100%;
		transition: max-height 0.3s ease-in-out;
		&.collapsed {
			max-height: 25px;
		}
	}

	.dropdown__close {
		position: absolute;
		top: 5px;
		right: 5px;
		font-size: 0.4rem;
	}

	dialog {
		width: 94%;
		height: calc(100vh - 5.75rem);
		bottom: 0;
		position: fixed;
		overflow: scroll;
	}
	.header {
		display: flex;
		align-items: center;

		:nth-child(2) {
			margin-left: auto;
			margin-right: 1rem;
		}

		i {
			display: none;
			cursor: pointer;
		}
	}
	.map__analysis__wrapper {
		display: flex;
		flex-direction: column;
		row-gap: 0.5rem;
		.card {
			height: 550px;
		}
	}

	.inner__container__group {
		display: grid;
		gap: 0.8rem;
		height: calc(100vh - 5.3rem);
		grid-template-columns: 225px 1fr 400px;
		grid-template-rows: 1fr;
		overflow: hidden;
	}

	@include media('<large') {
		.inner__container__group {
			padding: 0;
			margin-top: 16px;
			grid-template-columns: 1fr;
			height: calc(100vh - 8rem);
		}
		.header {
			i {
				display: block;
			}
		}
	}
</style>
