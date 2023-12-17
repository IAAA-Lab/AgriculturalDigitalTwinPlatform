<script lang="ts">
	import { userEnclosures } from '$lib/config/stores/enclosures';
	import AnalysisYearCompChart from './AnalysisYearCompChart.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { IMAGES_SERVER_URL } from '$lib/config/config';
	import type { Enclosure } from '$lib/core/Domain';
	import { onCropImageError } from '$lib/core/functions';

	let selectedEnclosureId: string;
	let selectedEnclosure: Enclosure | undefined;
	let limit: number = 365;
	let NUMBER_OF_CHARTS = 4;
	let maxPrecipitation = 0;
	let minDate = 0;
	let maxDate = 0;
	// string dates list where dates are date - limit
	let startDates = Array.from({ length: NUMBER_OF_CHARTS }, (_, i) => {
		// date = beginning of the year
		let date = new Date();
		date.setMonth(0);
		date.setDate(1);
		date.setDate(date.getDate() - i * limit);
		return date.toISOString().split('T')[0];
	}).sort((a, b) => (a > b ? 1 : -1));

	onMount(() => {
		selectedEnclosureId =
			$page.url.searchParams.get('enclosureId') || $userEnclosures?.map((e) => e.id).at(0) || '';
	});

	$: selectedEnclosure = $userEnclosures?.find((e) => e.id === selectedEnclosureId);
</script>

<section class="card">
	<div class="header mb-8">
		<div>
			<h2 class="m-0">Comparación de fechas</h2>
			<p class="m-0">Compara las características de un recinto</p>
		</div>
		<div class="input__wrapper mr-16">
			<label>{selectedEnclosure?.properties.cropName}</label>
			<img
				src={`${IMAGES_SERVER_URL}/${selectedEnclosure?.properties?.cropId}.png`}
				alt="Análisis"
				height="40px"
				on:error={onCropImageError}
			/>
		</div>
		<div class="input__wrapper">
			<label>Recinto</label>
			<select bind:value={selectedEnclosureId}>
				{#each $userEnclosures as enclosure}
					<option value={enclosure.id}>{enclosure.id}</option>
				{/each}
			</select>
		</div>
		<div class="input__wrapper">
			<label for="date">Días para buscar</label>
			<input type="number" placeholder="Días" bind:value={limit} min="0" max="365" />
		</div>
	</div>
	<div class="charts__wrapper">
		{#each startDates as date}
			<div class="card-inner">
				<AnalysisYearCompChart
					enclosures={[selectedEnclosureId]}
					{limit}
					startDate={date}
					idema={selectedEnclosure?.meteoStation.idema}
					bind:maxPrecipitation
					bind:minDate
					bind:maxDate
				/>
			</div>
		{/each}
	</div>
</section>

<style lang="scss">
	.header {
		display: flex;
		flex-wrap: wrap;
		column-gap: 0.5rem;
		:nth-child(2) {
			margin-left: auto;
		}
	}
	.charts__wrapper {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
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

	.card-inner {
		max-height: 450px;
	}

	@include media('<medium') {
		.input__wrapper {
			flex: 1;
			align-items: flex-start;
		}

		.charts__wrapper {
			grid-template-columns: 1fr;
		}
	}
</style>
