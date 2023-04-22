<script lang="ts">
	import Card from '$lib/components/panel/Card.svelte';
	import { listOfEnclosures } from '$lib/config/stores/selectedEnclosure';
	import AnalysisYearCompChart from './AnalysisYearCompChart.svelte';

	let selectedEnclosure: string = $listOfEnclosures.at(0) || '';
	let limit: number = 365;
	let NUMBER_OF_CHARTS = 4;
	// string dates list where dates are date - limit
	let startDates = Array.from({ length: NUMBER_OF_CHARTS }, (_, i) => {
		const date = new Date();
		date.setDate(date.getDate() - (i + 1) * limit);
		return date.toISOString().split('T')[0];
	});
</script>

<section>
	<Card>
		<div slot="header" class="header__wrapper">
			<div>
				<h2 class="m-0">Comparación de fechas</h2>
				<p class="text-sm m-0">Compara las características de un recinto</p>
			</div>
			<div class="header__input__wrapper">
				<div class="input__wrapper">
					<label>Recinto</label>
					<select bind:value={selectedEnclosure}>
						{#each $listOfEnclosures as enclosure}
							<option value={enclosure}>{enclosure}</option>
						{/each}
					</select>
				</div>
				<div class="input__wrapper">
					<label for="date">Característica</label>
					<select>
						<option value="ndvi">NDVI</option>
					</select>
				</div>
				<div class="input__wrapper">
					<label for="date">Días para buscar</label>
					<input type="number" placeholder="Días" bind:value={limit} min="0" max="365" />
				</div>
			</div>
		</div>
		<div slot="body" class="charts__wrapper">
			{#each startDates as date}
				<AnalysisYearCompChart {selectedEnclosure} {limit} startDate={date} />
			{/each}
		</div>
	</Card>
</section>

<style lang="scss">
	.charts__wrapper {
		// Two columns but it can be wrapped when the screen is too small
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		overflow-x: scroll;
	}

	label {
		white-space: nowrap;
	}

	input[type='number'] {
		min-width: 125px;
	}

	.header__wrapper,
	.chart__header {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		row-gap: 0.5rem;
		margin-bottom: 1rem;
		padding: 0 0.5rem;
	}

	.input__wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.header__input__wrapper {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	@include media('<small') {
		.chart {
			min-width: 100% !important;
		}
		.input__wrapper {
			flex: 1;
			align-items: flex-start;
		}
	}
</style>
