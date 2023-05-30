<script lang="ts">
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	import 'chartjs-adapter-date-fns';
	import zoomPlugin from 'chartjs-plugin-zoom';

	Chart.register(zoomPlugin);

	export let data: any = null;
	export const resetZoom = () => {
		myChart.resetZoom();
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
	};

	onMount(() => {
		drawChart();
		return () => {
			myChart?.destroy();
		};
	});
</script>

<canvas bind:this={chartCanvas} />
