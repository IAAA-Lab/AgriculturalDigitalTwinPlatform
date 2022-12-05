<script>
  import LineChart from "src/lib/infraestructure/presentation/components/charts/LineChart.svelte";
  import WeatherStat from "./WeatherStat.svelte";
  export let minTa;
  export let maxTa;
  export let taData;
  export let taLabels;
</script>

<div class="temp">
  <WeatherStat title="Temperatura">
    <i slot="header-icon" class="fi fi-rr-temperature-low pt-4" />
    <svelte:fragment slot="body">
      <div class="chart-wrap">
        <LineChart data={taData} labels={taLabels} color="#5C8CD3" />
      </div>
      <div class="min-max text-xs mt-4">
        <span style="color: #E54C4C;">Mín: {minTa} °</span>
        <span style="color: #524EF4;">Máx: {maxTa} °</span>
      </div>
    </svelte:fragment>
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
