<script lang="ts">
	export let ta: any;
	export let skyState: any;
	export let time: any;
</script>

<div class="card">
	<div class="body pl-8 pr-8">
		<span class="text-xs">{time} h</span>
		<slot name="icon" />
		<p class="m-0">{ta} °C</p>
		<span class="text-xxs">{skyState}</span>
	</div>
</div>

<style>
	.body {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		row-gap: 0.25rem;
		width: 85px;
	}

	span {
		text-align: center;
	}
</style>
