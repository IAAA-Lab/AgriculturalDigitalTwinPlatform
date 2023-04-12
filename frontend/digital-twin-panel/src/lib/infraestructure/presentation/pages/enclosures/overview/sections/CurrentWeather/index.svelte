<script>
  import { enclosuresService } from "src/app/config/config";
  import { getWeatherIcon } from "src/lib/core/functions";
  import Error from "src/lib/infraestructure/presentation/components/misc/Error.svelte";
  import Loading from "src/lib/infraestructure/presentation/components/misc/Loading.svelte";
  import CurrentWeatherFooter from "./components/CurrentWeatherFooter.svelte";
  import CurrentWeatherHeader from "./components/CurrentWeatherHeader.svelte";
  import HumidityWeatherStat from "./components/HumidityWeatherStat.svelte";
  import PrecipitationWeatherStat from "./components/PrecipitationWeatherStat.svelte";
  import TemperatureWeatherStat from "./components/TemperatureWeatherStat.svelte";
  import UvWeatherStat from "./components/UVWeatherStat.svelte";
  import WindWeatherStat from "./components/WindWeatherStat.svelte";

  let currentHour = new Date().getHours();
  export let enclosureId;
</script>

<section>
  {#await enclosuresService.getDailyWeather(enclosureId)}
    <Loading />
  {:then cw}
    {#if !cw}
      <Error />
    {:else}
      {@const pred = cw.prediction[0]}
      <CurrentWeatherHeader
        date={cw.elaboratedAt}
        address={cw.municipality + ", " + cw.province}
        ta={pred.ta.find((t) => t.period == currentHour)?.value.toString()}
        skyState={pred.skyState.find((t) => t.period == currentHour)
          ?.description}
      >
        <svelte:fragment slot="icon">
          {@html getWeatherIcon(
            pred.skyState?.find((t) => t.period == currentHour)?.description
          )}
        </svelte:fragment>
      </CurrentWeatherHeader>
      <div class="weather-stats mb-16">
        <TemperatureWeatherStat
          minTa={Math.min(...pred.ta.map((ta) => ta.value))}
          maxTa={Math.max(...pred.ta.map((ta) => ta.value))}
          taData={pred.ta}
        />
        <WindWeatherStat
          windSpeed={pred.wind.find((t) => t.period == currentHour)?.speed}
        />
        <HumidityWeatherStat
          minHr={pred.hr.find((t) => t.period == currentHour)?.value}
          maxHr={pred.hr.find((t) => t.period == currentHour)?.value}
          hrData={pred.hr}
        />
        <!-- <UvWeatherStat uv={pred.} /> -->
        <PrecipitationWeatherStat
          probPrec={pred.probPrec[0].value.toString()}
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
    <Error />
  {/await}
</section>

<style lang="scss">
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
