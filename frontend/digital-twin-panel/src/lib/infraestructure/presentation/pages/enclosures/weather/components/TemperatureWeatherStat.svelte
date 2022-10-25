<script>
  import LineChart from "src/lib/infraestructure/presentation/components/charts/LineChart.svelte";
  import WeatherStat from "./WeatherStat.svelte";
</script>

<div class="temp">
  <WeatherStat title="Temperatura">
    <i slot="header-icon" class="fi fi-rr-temperature-low pt-4" />
    <div slot="body">
      <div class="chart-wrap">
        <LineChart
          data={[1, 4, 2, 10, 1, 12]}
          labels={["1", "2", "3", "4", "5", "6"]}
          color="#5C8CD3"
        />
      </div>
      <div class="min-max text-xs mt-4">
        <span style="color: #E54C4C;">Mín: 12 °</span>
        <span style="color: #524EF4;">Máx: 23 °</span>
      </div>
    </div>
  </WeatherStat>
</div>

<style>
  .min-max {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }

  .chart-wrap {
    max-height: 80px;
  }

  .temp {
    grid-area: temp;
  }
</style>
