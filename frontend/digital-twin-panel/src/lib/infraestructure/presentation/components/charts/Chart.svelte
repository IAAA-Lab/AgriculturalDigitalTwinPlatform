<script lang="ts">
  import Chart from "chart.js/auto/auto";
  import { onMount } from "svelte";

  export let data: Chart.ChartConfiguration = null;

  let chartCanvas;
  let myChart;

  $: if (myChart) {
    myChart.data = data?.data;
    myChart.update();
  }

  const drawChart = async () => {
    const ctx = chartCanvas.getContext("2d");
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
