<script>
  import { onMount } from "svelte";
  import Chart from "chart.js/auto/auto.js";

  export let data = [];
  export let labels = [];

  let chartCanvas;

  onMount(() => {
    const ctx = chartCanvas.getContext("2d");
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            label: "Características",
            data,
            backgroundColor: ["#4c51bf", "#ed64a6", "#4299e1"],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        cutout: "70%",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              color: "#6b7280",
              usePointStyle: true,
              pointStyle: "rectRounded",
              boxWidth: 10,
              font: {
                size: 14,
              },
            },
          },
        },
      },
    });
  });
</script>

<canvas bind:this={chartCanvas} />
