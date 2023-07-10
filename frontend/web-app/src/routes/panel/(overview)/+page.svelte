<script lang="ts">
	import Characteristics from '$lib/components/panel/Characteristics.svelte';
	import FirstColTable from '$lib/components/panel/FirstColTable.svelte';
	import Map from '$lib/components/panel/MapOverview.svelte';
	import Summary from '$lib/components/panel/Summary.svelte';
	import Tables from '$lib/components/panel/Tables.svelte';
	import { userEnclosures } from '$lib/config/stores/enclosures';
	import { getColor } from '$lib/core/functions';

	$: enclosures = $userEnclosures;
</script>

<div class="container">
	<h1 class="title pb-16">Overview</h1>
	<div class="inner__container">
		<Characteristics {enclosures} />
		<Map {enclosures} />
		<Tables
			rows={enclosures.map((enclosure, index) => ({
				color: getColor(index),
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
					key: 'cultivo',
					title: 'Cultivo',
					value: (v) => v.properties.cropName || 'N/A',
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
				'tables tables tables';
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
