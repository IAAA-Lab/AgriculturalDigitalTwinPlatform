<script>
  import { parcelsService } from "src/app/config/config";
  import { formattedDate } from "src/lib/core/functions";
  import HumidityWeatherStat from "../components/HumidityWeatherStat.svelte";
  import PrecipitationWeatherStat from "../components/PrecipitationWeatherStat.svelte";
  import TemperatureWeatherStat from "../components/TemperatureWeatherStat.svelte";
  import UvWeatherStat from "../components/UVWeatherStat.svelte";
  import WindWeatherStat from "../components/WindWeatherStat.svelte";
</script>

<section>
  {#await parcelsService.getDailyWeather("45-137-0-0-9-23")}
    <p>loading...</p>
  {:then cw}
    {@const pred = cw.prediction.day[0]}
    <div class="header mb-8">
      <h2 class="m-0">Tiempo diario</h2>
      <p class="m-0 text-xs">{formattedDate(pred.date)}</p>
    </div>
    <div class="main-preview mb-16">
      <p class="m-0 text-sm">
        {cw.municipality},{cw.province}
      </p>
      <li class="fi fi-rr-cloud" />
      <p class="m-0 text-4xl">{pred.ta.max}</p>
      <p class="m-0 text-sm">{pred.skyState[2].description}</p>
    </div>
    <div class="weather-stats">
      <TemperatureWeatherStat
        minTa={pred.ta.min}
        maxTa={pred.ta.max}
        taData={pred.ta.data.map((v) => v.value)}
        taLabels={pred.ta.data.map((v) => v.hour + ":00 h")}
      />
      <WindWeatherStat windSpeed={pred.wind[2].vel} />
      <HumidityWeatherStat
        minHr={pred.hr.min}
        maxHr={pred.hr.max}
        hrData={pred.hr.data.map((v) => v.value)}
        hrLabels={pred.hr.data.map((v) => v.hour + ":00 h")}
      />
      <UvWeatherStat uv={pred.uvMax} />
      <PrecipitationWeatherStat probPrec={pred.probPrec[2].value} />
    </div>
    <div class="footer" />
  {:catch}
    <p>error</p>
  {/await}
</section>

<style>
  section {
    width: 350px;
    background: #ccdbf0;
    border: 2px solid #ffffff;
    border-radius: 10px;
    margin-left: 40px;
    padding: 15px;
  }

  .header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
  }

  .main-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background: #5c8cd3;
    border: 1px solid #e3e3e3;
    box-shadow: inset 0px 0px 30px rgba(52, 95, 160, 0.4);
    border-radius: 10px;
    height: 200px;
    padding: 15px;
    color: whitesmoke;
  }

  .weather-stats {
    display: grid;
    grid-template-areas:
      "temp temp temp"
      "wind humidity uv"
      "wind humidity precipitation";
    grid-template-columns: 3fr 3fr 1fr;
    grid-gap: 0.6rem;
  }
</style>
