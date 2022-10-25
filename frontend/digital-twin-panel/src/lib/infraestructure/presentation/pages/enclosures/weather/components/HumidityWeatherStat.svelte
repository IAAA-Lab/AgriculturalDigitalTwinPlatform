<script>
  import LineChart from "src/lib/infraestructure/presentation/components/charts/LineChart.svelte";
  import WeatherStat from "./WeatherStat.svelte";
</script>

<div class="hum">
  <WeatherStat title="Humedad">
    <i slot="header-icon" class="fi fi-rr-humidity pt-4" />
    <div slot="body" class="body">
      <div class="chart-wrap">
        <LineChart
          data={[12, 12, 24, 60, 50, 54]}
          labels={["1", "2", "3", "4", "5", "6"]}
          color="#5C8CD3"
        />
      </div>
      <p class="text-sm m-0"><strong>54 %</strong></p>
    </div>
  </WeatherStat>
</div>

<style>
  .body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .hum {
    grid-area: humidity;
  }

  .chart-wrap {
    height: 80px;
  }
</style>
