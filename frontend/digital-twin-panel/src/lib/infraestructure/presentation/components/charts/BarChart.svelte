<script lang="ts">
  import Chart from "chart.js/auto/auto";
  import { onMount } from "svelte";
  import config from "./config/BarChart.config";

  export let data: number[];
  export let labels: string[];
  export let color: string;
  export let yAxisLabel: string = "";
  export let title: string = "";

  let chartCanvas;
  let myChart;

  $: if (myChart) {
    myChart.options.plugins.title.text = title;
    myChart.options.scales.y.title.text = yAxisLabel;
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
        borderColor: "#2F3030",
        tension: 0.3,
        maxBarThickness: 40,
        borderWidth: 2,
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
