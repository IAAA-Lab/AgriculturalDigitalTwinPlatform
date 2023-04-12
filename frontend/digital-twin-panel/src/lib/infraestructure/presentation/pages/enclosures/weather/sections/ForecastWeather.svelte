<script lang="ts">
  import App from "src/App.svelte";
  import { enclosuresService } from "src/app/config/config";
  import { getWeatherIcon } from "src/lib/core/functions";
  import CardInner from "src/lib/infraestructure/presentation/components/cards/CardInner.svelte";
  import WeatherCard from "src/lib/infraestructure/presentation/components/cards/WeatherCard.svelte";
  import Error from "src/lib/infraestructure/presentation/components/misc/Error.svelte";
  import Loading from "src/lib/infraestructure/presentation/components/misc/Loading.svelte";
  import ForecastWeatherItem from "../components/ForecastWeatherItem.svelte";

  export let enclosureId: String;
  let aux = enclosureId.split("-");
  aux.pop();
  const parcelId = aux.join("-");
</script>

<section>
  <WeatherCard>
    <h3 class="m-0 mb-8" slot="header">Previsión (7 días)</h3>
    <div slot="body" style="overflow: hidden;">
      {#await enclosuresService.getForecastWeather(parcelId)}
        <Loading />
      {:then forecast}
        <CardInner>
          <div slot="body" class="p-8 body">
            {#each forecast.prediction.day as f, i}
              <ForecastWeatherItem
                day={f.date}
                minTa={f.ta.tamin}
                maxTa={f.ta.tamax}
              >
                <svelte:fragment slot="icon">
                  {@html getWeatherIcon(f.skyState[0].description)}
                </svelte:fragment>
              </ForecastWeatherItem>
              {#if i < forecast.prediction.day.length - 1}
                <div class="divider" />
              {/if}
            {/each}
          </div>
        </CardInner>
      {:catch error}
        <div>{error.message}</div>
        <Error />
      {/await}
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
    row-gap: 0.5rem;
    overflow-x: scroll;
  }

  .divider {
    width: 100%;
    height: 1px;
    background-color: rgb(195, 195, 195);
  }
</style>
