<script lang="ts">
	import Error from '$lib/components/misc/Error.svelte';
	import Loading from '$lib/components/misc/Loading.svelte';
	import Characteristics from '$lib/components/panel/Characteristics.svelte';
	import FirstColTable from '$lib/components/panel/FirstColTable.svelte';
	import Map from '$lib/components/panel/MapOverview.svelte';
	import Summary from '$lib/components/panel/Summary.svelte';
	import Tables from '$lib/components/panel/Tables.svelte';
	import { enclosuresService } from '$lib/config/config';
	import { listOfEnclosures } from '$lib/config/stores/selectedEnclosure';
	import { getColorList } from '$lib/core/functions';
</script>

<div class="container-responsive">
	<h1 class="title">Overview</h1>
	<div class="inner__container">
		{#await enclosuresService.getEnclosures($listOfEnclosures)}
			<Loading />
		{:then enclosures}
			<Characteristics {enclosures} />
			<Map {enclosures} />
			<Tables
				rows={enclosures.map((enclosure, index) => ({
					color: getColorList(enclosures.length)[index],
					id: enclosure.id,
					area: enclosure.properties.area,
					slope: enclosure.properties.slope,
					irrigationCoef: enclosure.properties.irrigationCoef,
					usedArea: enclosure.properties.areaSIGPAC,
					properties: enclosure.properties
				}))}
				columns={[
					{
						key: 'enclosureId',
						title: 'Recinto',
						value: (v) => v.id,
						sortable: true,
						renderComponent: FirstColTable
					},
					{
						key: 'Planta',
						title: 'Planta',
						value: (v) => v.properties.crop.name || 'N/A',
						sortable: true
					},
					{
						key: 'area',
						title: 'Área (Ha)',
						value: (v) => v.area,
						sortable: true
					},
					{
						key: 'areaSIGPAC',
						title: 'Área SIGPAC (Ha)',
						value: (v) => v.usedArea,
						sortable: true
					},
					{ key: 'slope', title: 'Pendiente (%)', value: (v) => v.slope },
					{
						key: 'irrigationCoef',
						title: 'Coef. de regadío (%)',
						value: (v) => v.irrigationCoef
					}
					// { key: "ndvi", title: "NDVI", value: (v) => v.ndvi, sortable: true },
				]}
			/>
		{:catch error}
			<Error errorMessage={error.message} />
		{/await}
		<Summary />
	</div>
</div>

<style lang="scss">
	.inner__container {
		display: grid;
		gap: 0.75rem;
		grid-template-areas:
			'map'
			'characteristics'
			'tables'
			'summary';
		:global(.summary) {
			display: none;
		}
	}

	@include media('>large') {
		.inner__container {
			grid-template-columns: 2.5fr 2.5fr 2fr;
			grid-template-areas:
				'map characteristics summary'
				'map characteristics summary'
				'tables tables summary';
			:global(.summary) {
				display: block;
			}
		}
		:global(.cupertino-pane-wrapper) {
			// Don't show the popup panel on large screens
			display: none !important;
		}
	}
</style>
