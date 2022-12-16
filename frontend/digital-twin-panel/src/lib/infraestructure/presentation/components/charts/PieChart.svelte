<script>
  import Chart from "chart.js/auto/auto";
  import { getColorList } from "src/lib/core/functions";
  import { onMount } from "svelte";
  import config from "./config/PieChart.config";

  export let data = [];
  export let labels = [];
  export let colors = [];

  let chartCanvas;
  let myChart;

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
        label: "Características",
        data,
        backgroundColor: colors,
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
    return () => {
      myChart?.destroy();
    };
  });
</script>

<canvas bind:this={chartCanvas} />
