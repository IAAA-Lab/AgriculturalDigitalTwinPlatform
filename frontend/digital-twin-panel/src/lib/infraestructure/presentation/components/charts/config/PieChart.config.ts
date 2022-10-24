let config = {
  type: "doughnut",
  data: {},
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
};

export default config;
