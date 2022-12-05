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
          <div class="divider" />
          <ForecastWeatherItem />
          <div class="divider" />
          <ForecastWeatherItem />
          <div class="divider" />
          <ForecastWeatherItem />
          <div class="divider" />
          <ForecastWeatherItem />
          <div class="divider" />
          <ForecastWeatherItem />
          <div class="divider" />
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
    row-gap: 0.7rem;
    overflow: scroll;
  }

  .divider {
    width: 100%;
    height: 1px;
    background-color: rgb(195, 195, 195);
  }
</style>
