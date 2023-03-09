<script lang="ts">
  import Chart from "chart.js/auto/auto";
  import { onMount } from "svelte";

  export let data: number[] = [];
  export let labels: string[] = [];
  export let datasets: any[];
  export let color: string = "blue";
  export let config: any = {};
  export let title: string = "";

  let chartCanvas;
  let myChart;

  $: if (myChart) {
    myChart.options.plugins.title.text = title;
    myChart.data.datasets.forEach((dataset, i) => {
      dataset.data = datasets[i].data;
    });
    myChart.data.labels = labels;
    myChart.update();
  }

  const dataConfig = {
    labels,
    datasets,
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
