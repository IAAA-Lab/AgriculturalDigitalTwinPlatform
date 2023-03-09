export default {
  label: "",
  data: null,
  fill: true,
  tension: 0.3,
  pointRadius: 0,
  // Chartjs background with linear gradient
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
    gradient.addColorStop(0, "rgba(255,255,255,0.7)");
    gradient.addColorStop(0.5, "rgba(252, 155, 104,1)");
    return gradient;
  },
  borderWidth: 0,
};
