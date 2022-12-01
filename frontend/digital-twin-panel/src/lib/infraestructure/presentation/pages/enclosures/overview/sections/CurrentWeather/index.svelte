<script>
  import { parcelsService } from "src/app/config/config";
  import CurrentWeatherFooter from "./components/CurrentWeatherFooter.svelte";
  import CurrentWeatherHeader from "./components/CurrentWeatherHeader.svelte";
  import HumidityWeatherStat from "./components/HumidityWeatherStat.svelte";
  import PrecipitationWeatherStat from "./components/PrecipitationWeatherStat.svelte";
  import TemperatureWeatherStat from "./components/TemperatureWeatherStat.svelte";
  import UvWeatherStat from "./components/UVWeatherStat.svelte";
  import WindWeatherStat from "./components/WindWeatherStat.svelte";

  let currentHour = new Date().getHours();
</script>

<section>
  {#await parcelsService.getDailyWeather("45-137-0-0-9-23")}
    <p>loading...</p>
  {:then cw}
    {#if !cw}
      <p>error</p>
    {:else}
      {@const pred = cw.prediction[0]}
      <CurrentWeatherHeader
        date={cw.elaboratedAt}
        address={cw.municipality + ", " + cw.province}
        ta={pred.ta.find((t) => t.period == currentHour)?.value}
        skyState={pred.skyState.find((t) => t.period == currentHour)
          ?.description}
      />
      <div class="weather-stats mb-16">
        <TemperatureWeatherStat
          minTa={Math.max(...pred.ta.map((ta) => ta.value))}
          maxTa={Math.min(...pred.ta.map((ta) => ta.value))}
          taData={pred.ta.map((v) => v.value)}
          taLabels={pred.ta.map((v) => v.period + ":00 h")}
        />
        <WindWeatherStat
          windSpeed={pred.wind.find((t) => t.period == currentHour)?.speed}
        />
        <HumidityWeatherStat
          minHr={pred.hr.find((t) => t.period == currentHour)?.value}
          maxHr={pred.hr.find((t) => t.period == currentHour)?.value}
          hrData={pred.hr.map((v) => v.value)}
          hrLabels={pred.hr.map((v) => v.period + ":00 h")}
        />
        <!-- <UvWeatherStat uv={pred.} /> -->
        <PrecipitationWeatherStat
          probPrec={pred.probPrec.find((t) => t.period == currentHour)?.value}
        />
      </div>
      <CurrentWeatherFooter
        producer={cw.origin.producer}
        web={cw.origin.web}
        copyright={cw.origin.copyright}
        legalNote={cw.origin.legalNote}
      />
    {/if}
  {:catch}
    <p>error</p>
  {/await}
</section>

<style>
  section {
    background: #ccdbf0;
    border: 2px solid #ffffff;
    border-radius: 10px;
    padding: 15px;
    grid-area: weather;
  }
  .weather-stats {
    display: grid;
    grid-template-areas:
      "temp temp temp"
      "wind humidity humidity"
      "wind precipitation precipitation";
    grid-template-columns: 3fr 3fr 1fr;
    grid-gap: 0.6rem;
  }
</style>
