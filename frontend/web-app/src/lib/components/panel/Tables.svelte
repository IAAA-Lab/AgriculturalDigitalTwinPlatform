<script lang="ts">
	import Table from './Table.svelte';

	//TODO: look at this table: https://gridjs.io/docs/config/data

	export let rows: any = [];
	export let columns: any = [];
</script>

<div class="card">
	<Table {rows} {columns} />
</div>

<style lang="scss">
	.card {
		grid-area: tables;
		overflow: hidden;
		max-height: 600px;
		overflow: scroll;
	}
</style>
