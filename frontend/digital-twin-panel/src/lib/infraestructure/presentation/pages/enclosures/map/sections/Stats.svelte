<script>
  import { getRangeBarColor } from "src/lib/core/functions";
  import Card from "src/lib/infraestructure/presentation/components/cards/Card.svelte";
  import CardInner from "src/lib/infraestructure/presentation/components/cards/CardInner.svelte";
  import LineChart from "src/lib/infraestructure/presentation/components/charts/LineChart.svelte";
  import Range from "src/lib/infraestructure/presentation/components/misc/Range.svelte";
  import config from "src/lib/infraestructure/presentation/components/charts/config/LineChart.config";
</script>

<Card>
  <h2 class="m-0" slot="header">NDVI</h2>
  <div slot="body" class="p-16 body">
    <div class="left">
      <CardInner class="ndvi__card">
        <div slot="body" class="range__bar">
          <Range value={82} to={100} background={getRangeBarColor(82)} />
          <h3 class="m-0">
            <strong>{((82 / 100) * 100).toPrecision(4)} %<strong /></strong>
          </h3>
        </div>
      </CardInner>
      <input type="date" />
    </div>
    <div class="chart__wrapper">
      <LineChart
        labels={[
          "20-10-2020",
          "21-10-2020",
          "22-10-2020",
          "23-10-2020",
          "24-10-2020",
          "25-10-2020",
          "26-10-2020",
        ]}
        datasets={[
          {
            data: [11, 20, 23, 2, 31, 2, 44, 23, 2],
            label: "Ganancias",
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
  </div>
</Card>

<style>
  .body {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .left {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .chart__wrapper {
    flex: 3;
    height: 250px;
    min-width: 200px;
  }

  .range__bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    white-space: nowrap;
    column-gap: 0.5rem;
    flex-wrap: wrap;
  }

  :global(.ndvi__card) {
    width: 100%;
  }
</style>
