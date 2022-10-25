<script>
  import Range from "src/lib/infraestructure/presentation/components/misc/Range.svelte";
  import WeatherStat from "./WeatherStat.svelte";
</script>

<div class="precipitation">
  <WeatherStat title="Precipitación">
    <i slot="header-icon" class="fi fi-rr-umbrella pt-4" />
    <div slot="body" class="body">
      <p class="text-sm m-0"><strong>44 mm</strong></p>
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
