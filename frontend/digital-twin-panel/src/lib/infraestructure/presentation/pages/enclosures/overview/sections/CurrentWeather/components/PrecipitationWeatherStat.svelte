<script>
  import WeatherStat from "./WeatherStat.svelte";
  export let probPrec = "--";
</script>

<div class="precipitation">
  <WeatherStat title="Prob. precipitación">
    <i slot="header-icon" class="fi fi-rr-umbrella pt-4" />
    <div slot="body" class="body">
      <p class="text-sm m-0"><strong>{probPrec} %</strong></p>
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

  .precipitation {
    grid-area: precipitation;
  }
</style>
