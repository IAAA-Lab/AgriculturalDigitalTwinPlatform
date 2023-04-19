<script lang="ts">
	import { getIconByCharacteristic } from '$lib/core/functions';
	import StatsCard from './StatsCard.svelte';

	export let properties: any = {};

	let chars: any = [];
	if (properties) {
		chars = [
			{
				name: 'Área',
				value: properties.area,
				unit: 'Ha'
			},
			{
				name: 'Área SIGPAC',
				value: properties.areaSIGPAC,
				unit: 'Ha'
			},
			{
				name: 'Nº árboles',
				value: properties.numberOfTrees
			},
			{
				name: 'Densidad de árboles',
				value: properties.plantationDensity
			},
			{
				name: 'Uso SIGPAC',
				value: properties.parcelUse
			}
		];
	}
</script>

<div class="characteristics">
	{#each chars as c}
		<div class="characteristics__item">
			<StatsCard statName={c?.name} statValue={c?.value} statUnit={c?.unit}>
				{@html getIconByCharacteristic(c)}
			</StatsCard>
		</div>
	{/each}
</div>

<style lang="scss">
	.characteristics {
		grid-area: characteristics;
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		gap: 0.5rem;
		.characteristics__item {
			flex: 200px;
		}
	}
</style>
