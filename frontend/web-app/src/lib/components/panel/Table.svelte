<script lang="ts">
	import SvelteTable from 'svelte-table';

	export let columns: any = [];
	export let rows: any = [];
</script>

<SvelteTable {columns} {rows} />
