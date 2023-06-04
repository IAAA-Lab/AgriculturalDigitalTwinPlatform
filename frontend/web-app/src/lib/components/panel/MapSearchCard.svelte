<script lang="ts">
	import { numberWithCommas, getRangeBarColor } from '$lib/core/functions';
	import { onMount } from 'svelte';
	import CardInner from './CardInner.svelte';
	import geojson2svg from 'geojson-to-svg';
	import Range from '../misc/Range.svelte';
	import type { NDVI } from '$lib/core/Domain';

	export let enclosureName: string = '--';
	export let location: string = '--';
	export let area: number | string = '--';
	export let geojsonFeature: any;
	export let color: string;
	export let cropName: string = '--';
	export let ndvi: NDVI | undefined;

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

	let ndviVal: number | undefined = undefined;

	$: ndviVal = ndvi?.ndvi.at(-1)?.value;
</script>

<CardInner>
	<div slot="body" class="body">
		{@html icon}
		<div class="content">
			<p class="m-0"><strong>{enclosureName}</strong></p>
			<p class="text-xs mb-4">{location}</p>
			<div class="card-item">
				<i class="fi fi-rr-map-marker" />
				<p class="m-0 pl-8">{numberWithCommas(area)} Ha</p>
			</div>
			<div class="card-item">
				<i class="fi fi-rr-corn" />
				<slot name="crops" />
				<p class="text-xs m-0">{cropName}</p>
			</div>
			<div class="card-item">
				<i class="fi fi-rr-heart" />
				<Range
					value={ndviVal ?? 0}
					to={1}
					height={12}
					background={getRangeBarColor(ndviVal ?? -1)}
				/>
				<p class="m-0">
					<strong>{numberWithCommas(ndviVal)}</strong>
				</p>
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
