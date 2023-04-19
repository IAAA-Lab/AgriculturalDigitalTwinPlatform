<script lang="ts">
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	import 'chartjs-adapter-date-fns';

	export let data: any = null;

	let chartCanvas: any;
	let myChart: any;

	$: if (myChart) {
		myChart.data = data?.data;
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
