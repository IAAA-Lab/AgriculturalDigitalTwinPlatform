<script lang="ts">
	import { getWeatherIcon } from '$lib/core/functions';
	export let ta: any;
	export let skyState: any;
</script>

<section>
	{#if !skyState || !ta}
		<div class="card" style="width: 500px;">
			<div class="header">
				<i class="fi fi-rr-cloud-showers-heavy" />
				<p class="m-0">Tiempo actual</p>
			</div>
			<div class="body">
				<p class="m-0">No hay datos disponibles</p>
			</div>
		</div>
	{:else}
		{#each skyState as state, i}
			{#if ta[i - 1]}
				<div class="card" style="width: 500px;">
					<span class="text-xs">{state?.period} h</span>
					{@html getWeatherIcon(state.description)}
					<p class="m-0">{ta[i - 1]?.value} °C</p>
					<span class="text-xxs">{state.description}</span>
				</div>
			{/if}
		{/each}
	{/if}
</section>

<style>
	section {
		grid-area: daily-weather;
		display: flex;
		flex-direction: row;
		column-gap: 0.5rem;
		overflow-x: scroll;
	}

	.card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		row-gap: 0.25rem;
		overflow: visible !important;
		max-width: 100px;
	}

	span {
		text-align: center;
	}
</style>
