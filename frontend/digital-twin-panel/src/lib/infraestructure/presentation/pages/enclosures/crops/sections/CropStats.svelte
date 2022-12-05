<script>
  import CardInner from "src/lib/infraestructure/presentation/components/cards/CardInner.svelte";
  import LineChart from "src/lib/infraestructure/presentation/components/charts/LineChart.svelte";
  import CropStatsCard from "../components/CropStatsCard.svelte";
  import config from "src/lib/infraestructure/presentation/components/charts/config/LineChart.config";
  import Card from "src/lib/infraestructure/presentation/components/cards/Card.svelte";
</script>

<section>
  <div class="crop__stats__wrapper">
    <CropStatsCard
      primary
      title={"Ganancias"}
      unit="€"
      value={23456}
      diff={0.34}
    />
    <CropStatsCard title={"Producción"} unit="Kg" value={365343} diff={-0.72} />
    <CropStatsCard title={"Rendimiento"} value={365343} diff={0.34} />
    <CropStatsCard title={"Área"} value={365343} diff={0.34} />
    <CropStatsCard title={"Cosecha"} value={365343} diff={0.34} />
  </div>
  <br />
  <Card class="chart__wrapper">
    <div slot="body" class="chart">
      <LineChart
        labels={["80", "80", "80", "80", "80", "80", "80"]}
        datasets={[
          {
            label: "Ganancias",
            data: [12, 19, 3, 5, 2, 3],
            fill: true,
            borderColor: "#fc9b68",
            backgroundColor: function (context) {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              if (!chartArea) {
                return null;
              }
              const gradient = ctx.createLinearGradient(
                0,
                chartArea.bottom,
                0,
                chartArea.top
              );
              gradient.addColorStop(0, "rgba(255,255,255,0.7)");
              gradient.addColorStop(0.8, "rgba(252, 155, 104,1)");
              return gradient;
            },
            tension: 0.2,
          },
        ]}
        {config}
      />
    </div>
  </Card>
</section>

<style>
  .crop__stats__wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .chart {
    height: 300px;
  }
</style>
