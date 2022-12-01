<script lang="ts">
  import Chart from "chart.js/auto/auto";
  import { onMount } from "svelte";
  import config from "./config/LineChart.config";

  export let data: number[];
  export let labels: string[];
  export let color: string;

  let chartCanvas;
  let myChart;

  $: if (myChart) {
    myChart.data.datasets[0].data = data;
    myChart.data.labels = labels;
    myChart.update();
  }

  const dataConfig = {
    labels,
    datasets: [
      {
        label: "",
        data,
        fill: false,
        borderColor: color,
        tension: 0.3,
      },
      {
        label: "",
        data: [80, 80, 80, 80, 80, 80, 80],
        fill: false,
        borderColor: "green",
        borderDash: [5, 5],
        borderWidth: 1,
        tension: 0.3,
        pointRadius: 0,
      },
      {
        label: "",
        data: [25, 25, 25, 25, 25, 25, 25],
        fill: false,
        borderColor: "red",
        borderDash: [5, 5],
        borderWidth: 1,
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  const drawChart = async () => {
    const ctx = chartCanvas.getContext("2d");
    myChart = new Chart(ctx, { ...config, data: dataConfig });
  };

  onMount(() => {
    drawChart();
  });
</script>

<canvas bind:this={chartCanvas} />
