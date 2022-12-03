<script>
  import CardInner from "src/lib/infraestructure/presentation/components/cards/CardInner.svelte";
  import WeatherCard from "src/lib/infraestructure/presentation/components/cards/WeatherCard.svelte";
  import ForecastWeatherItem from "../components/ForecastWeatherItem.svelte";
</script>

<section>
  <WeatherCard>
    <h3 class="m-0 mb-8" slot="header">Previsión (7 días)</h3>
    <div slot="body" style="overflow: hidden;">
      <CardInner>
        <div slot="body" class="p-8 body">
          <ForecastWeatherItem />
          <ForecastWeatherItem />
          <ForecastWeatherItem />
          <ForecastWeatherItem />
          <ForecastWeatherItem />
          <ForecastWeatherItem />
          <ForecastWeatherItem />
        </div>
      </CardInner>
    </div>
  </WeatherCard>
</section>

<style>
  section {
    grid-area: forecast-weather;
    overflow: hidden;
    min-width: 200px;
  }

  .body {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
    overflow: scroll;
  }
</style>
