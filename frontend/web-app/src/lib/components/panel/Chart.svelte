<script lang="ts">
	import Chart from 'chart.js/auto';
	import 'chartjs-adapter-date-fns';
	import zoomPlugin from 'chartjs-plugin-zoom';
	import { onMount } from 'svelte';

	Chart.register(zoomPlugin);

	export let data: any = null;
	export let clickedPoint = null;
	export const resetZoom = () => {
		myChart.resetZoom();
	};

	const onClick = (e: any) => {
		const activePoints = myChart.getElementsAtEventForMode(
			e,
			'nearest',
			{ intersect: false },
			true
		);
		if (activePoints.length > 0) {
			const clickedDatasetIndex = activePoints[0].datasetIndex;
			const clickedElementIndex = activePoints[0].index;
			const label = myChart.data.labels[clickedElementIndex];
			const value = myChart.data.datasets[clickedDatasetIndex].data[clickedElementIndex];
			clickedPoint = { label, value };
		}
		return null;
	};

	let chartCanvas: any;
	let myChart: any;

	$: if (myChart) {
		myChart.data = data?.data;
		myChart.options = data?.options;
		myChart.update();
	}

	const drawChart = async () => {
		const ctx = chartCanvas.getContext('2d');
		myChart = new Chart(ctx, data);
		myChart.canvas.onclick = onClick;
	};

	onMount(() => {
		drawChart();
		return () => {
			myChart?.destroy();
		};
	});
</script>

<canvas bind:this={chartCanvas} />
