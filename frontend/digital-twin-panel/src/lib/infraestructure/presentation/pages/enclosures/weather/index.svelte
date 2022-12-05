<script>
  import WeatherStats from "./sections/WeatherStats.svelte";
  import CurrentWeather from "./sections/CurrentWeather.svelte";
  import DailyWeather from "./sections/DailyWeather.svelte";
  import ForecastWeather from "./sections/ForecastWeather.svelte";
  import TempMap from "./sections/TempMap.svelte";

  export let id;
</script>

<h1 class="title">Recinto#{id} · Tiempo</h1>
<div class="container-responsive">
  <CurrentWeather />
  <DailyWeather />
  <WeatherStats />
  <ForecastWeather />
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
