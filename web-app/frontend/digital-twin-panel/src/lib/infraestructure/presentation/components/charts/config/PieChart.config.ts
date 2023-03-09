import type { ChartConfiguration } from "chart.js";

let config: ChartConfiguration = {
  type: "pie",
  data: null,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  },
};

export default config;
