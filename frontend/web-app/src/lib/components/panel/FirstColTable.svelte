<script lang="ts">
	import geojson2svg from 'geojson-to-svg';
	import mapStore from '../../../routes/panel/(map)/store';

	export let row: any;
	export let col: any;

	let icon = '';

	$: {
		icon = geojson2svg()
			.styles((e: any, i: any, a: any) => {
				return {
					fill: row.color,
					opacity: 0.7
				};
			})
			.data(row.geojsonFeature)
			.render()
			// Replace the svg tag with a svg tag with the desired width and height and add border color black adapted to the shape
			.replace('svg', "svg width='45' height='25'");
	}
</script>

<td>
	<input
		type="checkbox"
		on:change={() => {
			mapStore.set({
				selectedEnclosure: row.geojsonFeature,
				flyToCoords: $mapStore.flyToCoords
			});
		}}
	/>
	<a
		href={`/panel/monitoring?enclosureId=${row.id}`}
		style="display: flex; flex-direction: row; align-items: center; justify-content: flex-start;"
	>
		{@html icon}
		<p class="m-0">{row.id}</p>
	</a>
</td>

<style lang="scss">
	td {
		display: flex;
		gap: 1rem;
		align-items: center;
		justify-content: flex-start;
		border-bottom: 0;

		input {
			visibility: hidden;
		}
		&:hover {
			input {
				visibility: visible;
			}
		}
	}

	:global(svg) {
		transform: scaleX(-1) rotate(180deg);
	}
</style>
