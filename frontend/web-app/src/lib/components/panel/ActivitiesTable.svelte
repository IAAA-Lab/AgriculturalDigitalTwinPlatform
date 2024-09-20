<script lang="ts">
	import type { Activity } from '../../core/Domain';
	import Table from './Table.svelte';

	export let activities: Activity[] = [];
</script>

<Table
	rows={activities}
	columns={[
		{ key: 'activity', title: 'Actividad', value: (v) => v?.activity },
		{
			key: 'date',
			title: 'Fecha',
			value: (v) => v.date.split('T')[0]
		},
		{
			key: 'yield',
			title: 'Cosecha',
			value: (v) => v?.yield
		},
		{
			key: 'status',
			title: 'Estado',
			value: (v) => v?.status || 'Acabado'
		}
	]}
/>
