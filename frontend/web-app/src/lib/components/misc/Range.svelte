<script lang="ts">
	export let value: number;
	export let height: number = 15;
	export let background: string = 'grey';
	export let to: number = 100;

	$: value = value < 0 ? 0 : value;
</script>

<div
	class="range-bar"
	style="--range-bar-width: {(value / to) *
		100}%; --range-bar-color: {background}; --range-bar-height: {height}px"
/>

<style lang="scss">
	.range-bar {
		width: 100%;
		height: var(--range-bar-height, 20px);
		background: rgb(220, 220, 220);
		border-radius: 5px;
		padding: 3px;
		overflow: hidden;
		min-width: 70px;

		&:before {
			content: '';
			display: block;
			width: var(--range-bar-width, 50%);
			height: 100%;
			background: var(--range-bar-color, rgb(220, 220, 220));
			border-radius: 3px;
		}
	}
</style>
