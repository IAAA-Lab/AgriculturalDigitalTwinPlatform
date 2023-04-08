<script>
  import WeatherStats from "./sections/WeatherStats.svelte";
  import CurrentWeather from "./sections/CurrentWeather.svelte";
  import DailyWeather from "./sections/DailyWeather.svelte";
  import ForecastWeather from "./sections/ForecastWeather.svelte";
  import TempMap from "./sections/TempMap.svelte";
  import Error from "../../../components/misc/Error.svelte";
  import { enclosuresService } from "src/app/config/config";
  import Loading from "../../../components/misc/Loading.svelte";

  export let id;
</script>

<h1 class="title">Recinto#{id} · Tiempo</h1>
<div class="container-responsive">
  {#await enclosuresService.getDailyWeather(id)}
    <Loading />
  {:then cw}
    {@const pred = cw.prediction[0]}
    <CurrentWeather {cw} />
    <DailyWeather ta={pred.ta} skyState={pred.skyState} />
    <WeatherStats pred={cw.prediction[0]} />
  {:catch error}
    <Error errorMessage={error.message} />
  {/await}
  <ForecastWeather enclosureId={id} />
  <TempMap />
</div>

<style lang="scss">
  .container-responsive {
    display: grid;
    grid-template-columns: 2fr 2fr 1fr;
    grid-template-areas:
      "daily-weather daily-weather current-weather"
      "weather-stats forecast-weather current-weather"
      "weather-stats temp-map temp-map";
    gap: 1rem;
  }

  @include media("<large") {
    .container-responsive {
      grid-template-columns: 1fr;
      grid-template-areas:
        "current-weather"
        "daily-weather"
        "weather-stats"
        "forecast-weather"
        "temp-map";
    }
  }
</style>
