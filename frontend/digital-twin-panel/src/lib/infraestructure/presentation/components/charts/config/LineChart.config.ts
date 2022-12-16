import type { ChartConfiguration } from "chart.js";

let config: ChartConfiguration = {
  type: "line",
  data: null,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "",
        font: {
          size: 14,
        },
      },
    },
    scales: {
      x: {
        grid: {
          drawBorder: false,
          display: false,
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 6,
        },
      },
      y: {
        min: -15,
        max: 50,
        grid: {
          drawBorder: false,
        },
      },
    },
  },
};

export default config;
