<script lang="ts">
	import { enclosuresService } from '$lib/config/config';
	import { numberWithCommas, getRangeBarColor } from '$lib/core/functions';
	import { onMount } from 'svelte';
	import Loading from '../misc/Loading.svelte';
	import CardInner from './CardInner.svelte';
	import geojson2svg from 'geojson-to-svg';
	import Error from '../misc/Error.svelte';
	import Range from '../misc/Range.svelte';

	export let enclosureName: string = '--';
	export let location: string = '--';
	export let area: number | string = '--';
	export let geojsonFeature: any;
	export let color: string;
	export let cropName: string = '--';

	let icon: any = null;

	onMount(() => {
		// Convert geojson features to the svg image we see, imitating the ones in the map
		icon = geojson2svg()
			.styles((e: any, i: any, a: any) => {
				return {
					fill: color,
					opacity: 0.7
				};
			})
			.data(geojsonFeature)
			.render()
			// Replace the svg tag with a svg tag with the desired width and height and add border color black adapted to the shape
			.replace('svg', "svg width='125' height='125'");
	});
</script>

<CardInner>
	<div slot="body" class="body">
		{@html icon}
		<div class="content">
			<p class="text-sm m-0"><strong>{enclosureName}</strong></p>
			<p class="text-xs mb-4">{location}</p>
			<div class="card-item">
				<i class="fi fi-rr-map-marker" />
				<p class="text-sm m-0 pl-8">{numberWithCommas(area)} Ha</p>
			</div>
			<div class="card-item">
				<i class="fi fi-rr-corn" />
				<slot name="crops" />
				<p class="text-xs m-0">{cropName}</p>
			</div>
			<div class="card-item">
				<i class="fi fi-rr-heart" />
				{#await enclosuresService.getNDVI([enclosureName], null, null, 1)}
					<Loading />
				{:then ndvi}
					{@const ndviVal = ndvi?.at(0)?.ndvi.at(-1)?.value}
					<Range
						value={ndviVal ?? 0}
						to={1}
						height={12}
						background={getRangeBarColor(ndviVal ?? -1)}
					/>
					<p class="text-sm m-0">
						<strong>{numberWithCommas(ndviVal)}</strong>
					</p>
				{:catch}
					<Error />
				{/await}
			</div>
		</div>
	</div>
</CardInner>

<style lang="scss">
	.body {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		gap: 1rem;

		.content {
			flex: 1;
		}
		.card-item {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 0.5rem;

			p {
				white-space: nowrap;
			}
		}

		:global(svg) {
			transform: rotate(180deg) scaleX(-1);
		}
	}
</style>
