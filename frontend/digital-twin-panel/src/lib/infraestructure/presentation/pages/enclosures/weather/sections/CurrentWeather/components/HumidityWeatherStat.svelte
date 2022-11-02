<script>
  import LineChart from "src/lib/infraestructure/presentation/components/charts/LineChart.svelte";
  import WeatherStat from "./WeatherStat.svelte";
  export let minHr;
  export let maxHr;
  export let hrData;
  export let hrLabels;
</script>

<div class="hum">
  <WeatherStat title="Humedad">
    <i slot="header-icon" class="fi fi-rr-humidity pt-4" />
    <div slot="body" class="body">
      <div class="chart-wrap">
        <LineChart data={hrData} labels={hrLabels} color="#5C8CD3" />
      </div>
      <p class="text-sm m-0"><strong>{minHr} %</strong></p>
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
