<svelte:options immutable />

<script lang="ts">
	import Filter from '$lib/components/panel/Filter.svelte';
	import FirstColTable from '$lib/components/panel/FirstColTable.svelte';
	import Map from '$lib/components/panel/Map.svelte';
	import NdviColTable from '$lib/components/panel/NDVIColTable.svelte';
	import TablePagination from '$lib/components/panel/TablePagination.svelte';
	import WeatherTabMap from '$lib/components/panel/WeatherTabMap.svelte';
	import { enclosuresService } from '$lib/config/config';
	import { userEnclosures } from '$lib/config/stores/enclosures';
	import type { Enclosure } from '$lib/core/Domain';
	import { getColor, numberWithCommas } from '$lib/core/functions';
	import { onMount } from 'svelte';
	import mapStore from './store';

	let distance: number;
	let enclosures: Enclosure[] | undefined = $userEnclosures;
	let filteredEnclosures: Enclosure[] | undefined = undefined;
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
	// Toolbars
	const navOptions = {
		GENERAL: 1,
		WEATHER: 2,
		PHYTOSANITARIES: 3
	};
	let selectedNavOption = navOptions.GENERAL;

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
			.slice(0, limit === 0 ? enclosures.length : limit);
	}

	$: {
		if (!$mapStore.selectedEnclosure) {
			enclosures = $userEnclosures;
			getNDVI($userEnclosures.map((e) => e.id));
		}
	}

	$: {
		// When distance changes, we need to search for the neighbors of the selected enclosure
		if (distance && $mapStore.selectedEnclosure) {
			enclosuresService
				.getEnclosureNeighbors($mapStore.selectedEnclosure.id, distance)
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

	onMount(() => {
		// Click outside of the dialog to close it
		document.addEventListener('click', (e) => {
			const filtersDialog = document.getElementById('filters-dialog');
			if (filtersDialog && !filtersDialog.contains(e.target as Node)) {
				showFilters = false;
			}
		});
	});
</script>

<h1 class="mt-0">Mapa</h1>
<section class="container-responsive">
	<div class="card filter" style="grid-area: filter">
		<Filter
			{enclosures}
			bind:checkedCrops
			bind:checkedLocations
			bind:orderBy
			bind:limit
			bind:checkedProvinces
			bind:checkedCCAA
		/>
	</div>
	<div class="map" style="grid-area: map; position: relative">
		{#if filteredEnclosures}
			<Map bind:enclosures={filteredEnclosures} bind:distance />
		{/if}
	</div>
	<nav class="tools-bar" style="grid-area: tools-bar">
		<i class="fi fi-rr-table-layout" on:click={() => (selectedNavOption = navOptions.GENERAL)} />
		<i class="fi fi-rr-cloud-sun" on:click={() => (selectedNavOption = navOptions.WEATHER)} />
		<!-- <i
			class="fi fi-rr-bacteria"
			on:click={() => (selectedNavOption = navOptions.PHYTOSANITARIES)}
		/> -->
	</nav>
	<div class="card analysis" style="grid-area: analysis">
		{#if selectedNavOption === navOptions.GENERAL}
			<TablePagination
				length={10}
				rows={filteredEnclosures?.map((enclosure, index) => ({
					color: getColor(index),
					id: enclosure.id,
					geojsonFeature: enclosure,
					area: enclosure.properties.area,
					slope: enclosure.properties.slope,
					irrigationCoef: enclosure.properties.irrigationCoef,
					usedArea: enclosure.properties.areaSIGPAC,
					cropName: enclosure.properties.cropName,
					ndvi: enclosure.properties.ndvi?.ndvi?.at(0)?.value
				}))}
				columns={[
					{
						key: 'enclosureId',
						title: 'Recinto',
						sortable: true,
						value: (v) => {
							return {
								enclosureId: v.id,
								geojsonFeature: v.geojsonFeature,
								color: v.color
							};
						},
						renderComponent: FirstColTable
					},
					{
						key: 'cultivo',
						title: 'Cultivo',
						value: (v) => v.cropName || 'N/A',
						sortable: true
					},
					{
						key: 'area',
						title: 'Área (Ha)',
						value: (v) => numberWithCommas(v.area),
						sortable: true
					},
					{
						key: 'areaSIGPAC',
						title: 'Área SIGPAC (Ha)',
						value: (v) => numberWithCommas(v.usedArea),
						sortable: true
					},
					{ key: 'slope', title: 'Pendiente (%)', value: (v) => v.slope },
					{
						key: 'irrigationCoef',
						title: 'Coef. de regadío (%)',
						value: (v) => v.irrigationCoef
					},
					{
						key: 'ndvi',
						title: 'NDVI',
						sortable: true,
						renderComponent: NdviColTable
					}
				]}
			/>
		{:else if selectedNavOption === navOptions.WEATHER}
			<WeatherTabMap enclosureIds={filteredEnclosures?.map((e) => e.id)} />
		{/if}
		<!-- {:else if selectedNavOption === navOptions.PHYTOSANITARIES}
			<PhytosanitariesTabMap enclosureIds={filteredEnclosures?.map((e) => e.id)} />
		{/if} -->
	</div>
</section>

<style lang="scss">
	nav {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	section {
		display: grid;
		gap: 0.8rem;
		height: calc(100vh - 6rem);
		grid-template-columns: auto 1fr auto;
		grid-template-rows: 1.25fr 1fr;
		grid-template-areas:
			'filter map tools-bar'
			'filter analysis analysis';
		overflow: hidden;
	}
	.analysis {
		position: relative;
		max-height: 100%;
		height: 100%;
	}

	.card {
		height: 96%;
	}
	dialog {
		width: 94%;
		height: calc(100vh - 6rem);
		bottom: 0;
		position: fixed;
		overflow: scroll;
	}

	@include media('<medium') {
		.filter {
			display: none;
		}
	}

	aside {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}
</style>
