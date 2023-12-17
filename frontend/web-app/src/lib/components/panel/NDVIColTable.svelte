<script lang="ts">
	import { getRangeBarColor, numberWithCommas } from '$lib/core/functions';
	import Range from '../misc/Range.svelte';

	export let row: any;
	export let col: any;
</script>

<td>
	<Range value={row.ndvi || 0} to={1} height={10} background={getRangeBarColor(row.ndvi || 0)} />
	<span>{numberWithCommas(row.ndvi)}</span>
</td>

<style lang="scss">
	td {
		display: flex;
		gap: 1rem;
		align-items: center;
		justify-content: flex-start;
		border-bottom: 0;
	}
</style>
