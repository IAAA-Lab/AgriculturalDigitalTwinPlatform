<script lang="ts">
	import CurrentWeatherFooter from '$lib/components/panel/CurrentWeatherFooter.svelte';
	import CurrentWeatherHeader from '$lib/components/panel/CurrentWeatherHeader.svelte';
	import { getWeatherIcon } from '$lib/core/functions';

	export let cw: any;
	const pred = cw?.prediction?.at(0);
	let currentHour = new Date().getHours();
</script>

<section>
	<div class="card">
		{#if !cw || !pred}
			<div class="card-inner">
				<div class="header">
					<i class="fi fi-rr-cloud-showers-heavy" />
					<p class="m-0">Tiempo actual</p>
				</div>
				<div class="body">
					<p class="m-0">No hay datos disponibles</p>
				</div>
			</div>
		{:else}
			<CurrentWeatherHeader
				date={cw.elaboratedAt}
				address={cw.municipality + ', ' + cw.province}
				ta={pred.ta?.find((t) => t.period == currentHour)?.value}
				skyState={pred.skyState?.find((t) => t.period == currentHour)?.description}
			>
				<svelte:fragment slot="icon">
					{@html getWeatherIcon(pred.skyState?.find((t) => t.period == currentHour)?.description)}
				</svelte:fragment>
			</CurrentWeatherHeader>
			<br />
			<CurrentWeatherFooter
				producer={cw.origin?.producer}
				web={cw.origin?.web}
				copyright={cw.origin?.copyright}
				legalNote={cw.origin?.legalNote}
			/>
		{/if}
	</div>
</section>

<style lang="scss">
	section {
		grid-area: current-weather;
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}
</style>
