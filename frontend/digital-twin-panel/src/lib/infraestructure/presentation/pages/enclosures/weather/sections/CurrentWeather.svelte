<script>
  import WeatherCard from "src/lib/infraestructure/presentation/components/cards/WeatherCard.svelte";
  import CurrentWeatherFooter from "../../overview/sections/CurrentWeather/components/CurrentWeatherFooter.svelte";

  import CurrentWeatherHeader from "../../overview/sections/CurrentWeather/components/CurrentWeatherHeader.svelte";

  let cw = {};
  let pred = {};
  let currentHour = 0;
</script>

<section>
  <WeatherCard>
    <svelte:fragment slot="body">
      <CurrentWeatherHeader
        date={cw.elaboratedAt}
        address={cw.municipality + ", " + cw.province}
        ta={pred.ta?.find((t) => t.period == currentHour)?.value}
        skyState={pred.skyState?.find((t) => t.period == currentHour)
          ?.description}
      />
      <br />
      <CurrentWeatherFooter
        producer={cw.origin?.producer}
        web={cw.origin?.web}
        copyright={cw.origin?.copyright}
        legalNote={cw.origin?.legalNote}
      />
    </svelte:fragment>
  </WeatherCard>
</section>

<style>
  section {
    grid-area: current-weather;
    max-width: 300px;
  }
</style>
