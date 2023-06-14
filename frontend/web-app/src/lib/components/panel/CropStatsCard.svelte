<script lang="ts">
	import { numberWithCommas } from '$lib/core/functions';
	import { es } from 'date-fns/locale';
	import CardInner from './CardInner.svelte';
	import CardInnerPrimary from './CardInnerPrimary.svelte';
	import Chart from './Chart.svelte';

	export let title: string;
	export let value: number;
	export let unit: string = '';
	export let diff: number;
	export let primary: boolean = false;
	export let datasets: number[] = [];
	export let labels: string[] = [];

	let diffColor: string;
	let diffIcon: string;

	$: diffColor = diff > 0 ? 'text-color-success' : 'text-color-error';
	$: diffIcon = diff > 0 ? 'up' : 'down';
</script>

<svelte:component this={primary ? CardInnerPrimary : CardInner}>
	<div slot="header" class="card-header pt-8 tt-u">
		<h4 class="stat-header m-0">
			{title}
		</h4>
	</div>
	<div slot="body" class="stat-body">
		<div class="value-unit">
			<h2 class="m-0 fw-700">{numberWithCommas(value)}</h2>
			<span class={unit && 'ml-4'}>{unit}</span>
		</div>
		<div class="icon-diff">
			<span class="diff text-xs {diffColor}">
				<i class="fi fi-rr-angle-small-{diffIcon} {diffColor}" />
				{diff}
			</span>
		</div>
		<div class="chart">
			<Chart
				data={{
					data: {
						datasets: [
							{
								type: 'line',
								data: datasets.map((data, i) => ({
									x: labels[i],
									y: data
								})),
								label: title,
								backgroundColor: 'rgba(0, 0, 0, 0)',
								borderColor: '#1e88e5',
								borderWidth: 2,
								// pointRadius: 0,
								pointHoverRadius: 5,
								tension: 0.3
							}
						]
					},
					options: {
						responsive: true,
						maintainAspectRatio: false,
						plugins: {
							legend: {
								display: false
							}
						},
						scales: {
							y: {
								display: false
							},
							x: {
								display: false
							}
						}
					}
				}}
			/>
		</div>
	</div>
</svelte:component>

<style lang="scss">
	.stat-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.stat-body {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.value-unit {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
		}

		.diff {
			background-color: #fbfbfb;
			padding: 3px 8px;
			border-radius: 7px;
		}

		.chart {
			height: 100px;
			max-width: 300px;
			width: 100%;
		}
	}
</style>
