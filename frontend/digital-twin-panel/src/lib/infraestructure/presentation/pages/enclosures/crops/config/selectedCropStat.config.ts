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
        font: {
          size: 16,
        },
      },
    },
    scales: {
      x: {
        grid: {
          drawBorder: false,
          display: false,
        },
      },
      y: {
        min: 0,
        grid: {
          drawBorder: false,
        },
      },
    },
  },
};

export default config;
