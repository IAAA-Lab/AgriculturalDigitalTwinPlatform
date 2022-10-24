<script>
  import Chart from "chart.js/auto/auto";
  import { getColorList } from "src/lib/core/functions";
  import { onMount } from "svelte";
  import config from "./config/PieChart.config";

  export let data = [];
  export let labels = [];

  let chartCanvas;
  let myChart;

  $: if (myChart) {
    myChart.data.datasets[0].data = data;
    myChart.data.labels = labels;
    myChart.data.datasets[0].backgroundColor = getColorList(data.length);
    myChart.update();
  }

  const dataConfig = {
    labels,
    datasets: [
      {
        label: "Características",
        data,
        backgroundColor: getColorList(data.length),
        hoverOffset: 4,
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
