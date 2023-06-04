<script lang="ts">
	import Card from './Card.svelte';
	import Table from './Table.svelte';

	//TODO: look at this table: https://gridjs.io/docs/config/data

	export let rows: any = [];
	export let columns: any = [];
</script>

<section>
	<Card>
		<div slot="body">
			<Table {rows} {columns} />
		</div>
	</Card>
</section>

<style lang="scss">
	section {
		grid-area: tables;
		overflow: hidden;
		margin-top: 1.25rem;

		div {
			max-height: 600px;
			overflow: scroll;
		}
	}
</style>
