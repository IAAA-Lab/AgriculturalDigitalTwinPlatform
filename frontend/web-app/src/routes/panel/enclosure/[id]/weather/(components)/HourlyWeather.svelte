<script lang="ts">
	import WeatherCard from '$lib/components/panel/WeatherCard.svelte';

	export let ta: any;
	export let skyState: any;
	export let time: any;
</script>

<WeatherCard>
	<div slot="body" class="body pl-16 pr-16">
		<span class="text-xs">{time} h</span>
		<slot name="icon" />
		<p class="text-m m-0">{ta} °C</p>
		<span class="text-xs">{skyState}</span>
	</div>
</WeatherCard>

<style>
	.body {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		row-gap: 0.25rem;
		width: 85px;
	}
</style>
