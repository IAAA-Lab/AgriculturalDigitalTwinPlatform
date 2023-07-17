<script>
	import AnalysisYearComp from '$lib/components/panel/AnalysisYearComp.svelte';
	import FirstColTable from '$lib/components/panel/FirstColTable.svelte';
	import Tables from '$lib/components/panel/Tables.svelte';
	import { userEnclosures } from '$lib/config/stores/enclosures';
	import { getColor, numberWithCommas } from '$lib/core/functions';
</script>

<div class="container-responsive">
	<h1>Análisis</h1>
	<AnalysisYearComp />
	<Tables
		rows={$userEnclosures.map((enclosure, index) => ({
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
			}
			// { key: "ndvi", title: "NDVI", value: (v) => v.ndvi, sortable: true },
		]}
	/>
</div>
