import type { ChartConfiguration } from "chart.js";

let config: ChartConfiguration = {
  type: "bar",
  data: null,
  options: {
    elements: {
      bar: {
        borderRadius: 6,
        borderWidth: 0,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            // This case happens on initial chart load
            return null;
          }
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top
          );
          gradient.addColorStop(0, "#3fc7f5a0");
          gradient.addColorStop(0.5, "#2140f5a0");
          return gradient;
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
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
