<script lang="ts">
	import type { Treatment } from '$lib/core/Domain';
	import Table from './Table.svelte';

	export let treatments: Treatment[] = [];
</script>

<Table
	rows={treatments}
	columns={[
		{ key: 'product', title: 'Producto', value: (v) => v.phytosanitary.name },
		{
			key: 'date',
			title: 'Fecha',
			value: (v) => v.date.split('T')[0]
		},
		{
			key: 'phytoFormula',
			title: 'Formula fitosanitario',
			value: (v) => v.phytosanitary.formula
		},
		{
			key: 'dosage',
			title: 'Dosis',
			value: (v) => v.quantity.toPrecision(5) + ' ' + v.doseUnit
		},
		{
			key: 'plague',
			title: 'Plaga',
			value: (v) => v.plague.name
		}
		// {
		//   key: "broth",
		//   title: "Caldo",
		//   value: (v) => v.broth,
		// },
		// {
		//   key: "dosisMovement",
		//   title: "Movimiento de parcela",
		//   value: (v) => v.doseMovement,
		// },
	]}
/>
