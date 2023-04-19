<script lang="ts">
	export let row: any;
</script>

<td>
	<div class="square" style="--square-color: {row.color};" />
	<p class="m-0">{row.id}</p>
</td>

<style>
	td {
		display: flex;
		gap: 1rem;
		align-items: center;
		justify-content: flex-start;
		border-bottom: 0;
	}

	.square {
		width: 15px;
		height: 15px;
		border: 2px solid rgb(99, 99, 99);
		border-radius: 5px;
		background-color: var(--square-color);
	}
</style>
