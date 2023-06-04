<script>
	import { getRangeBarColor, numberWithCommas } from '$lib/core/functions';
	import Range from '../misc/Range.svelte';
	import Card from './Card.svelte';

	let value = 25;
</script>

<section>
	<Card>
		<h4 slot="header" class="m-0 mb-8">Salud de las plantas (NDVI)</h4>
		<div slot="body" class="range">
			<Range value={0.1} to={1} background={getRangeBarColor(0.1)} />
			<span class="fw-700 ml-8">{10} %</span>
		</div>
	</Card>
	<Card>
		<h4 slot="header" class="m-0 mb-8">Área en uso</h4>
		<div slot="body" class="range">
			<Range {value} background={getRangeBarColor(value)} />
			<span class="fw-700 ml-8">{numberWithCommas(value)}</span>
		</div>
	</Card>
</section>

<style lang="scss">
	section {
		grid-area: rangeCharacteristics;
		display: flex;
		flex-direction: column;
		justify-content: end;
		gap: 0.5rem;

		.range {
			display: flex;
			align-items: center;
			justify-content: space-between;
			white-space: nowrap;
		}
	}
</style>
