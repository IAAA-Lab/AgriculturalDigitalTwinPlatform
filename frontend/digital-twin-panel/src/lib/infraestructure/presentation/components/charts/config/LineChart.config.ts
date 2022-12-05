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
        text: "NDVI (Últimos 30 días)",
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
      },
      y: {
        grid: {
          drawBorder: false,
        },
      },
    },
  },
};

export default config;
