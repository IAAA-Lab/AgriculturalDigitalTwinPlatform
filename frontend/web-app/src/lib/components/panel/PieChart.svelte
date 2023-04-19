<script lang="ts">
	import Chart from 'chart.js/auto/auto';
	import { onMount } from 'svelte';

	export let data: any = [];
	export let labels: any = [];
	export let colors: any = [];

	let chartCanvas: any;
	let myChart: any;

	$: if (myChart) {
		myChart.data.datasets[0].data = data;
		myChart.data.labels = labels;
		myChart.data.datasets[0].backgroundColor = colors;
		myChart.update();
	}

	const dataConfig = {
		labels,
		datasets: [
			{
				label: 'Características',
				data,
				backgroundColor: colors,
				hoverOffset: 4
			}
		]
	};

	const drawChart = async () => {
		const ctx = chartCanvas.getContext('2d');
		myChart = new Chart(ctx, { data: dataConfig });
	};

	onMount(() => {
		drawChart();
		return () => {
			myChart?.destroy();
		};
	});
</script>

<canvas bind:this={chartCanvas} />
