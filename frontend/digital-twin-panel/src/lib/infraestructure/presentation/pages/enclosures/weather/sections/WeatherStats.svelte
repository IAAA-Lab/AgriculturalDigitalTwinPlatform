<script>
  import WeatherCard from "src/lib/infraestructure/presentation/components/cards/WeatherCard.svelte";
  import BarChart from "src/lib/infraestructure/presentation/components/charts/BarChart.svelte";
  import LineChart from "src/lib/infraestructure/presentation/components/charts/LineChart.svelte";
  import config from "../components/config/tempLineChart.config";
  import Loading from "src/lib/infraestructure/presentation/components/misc/Loading.svelte";
  import { parcelsService } from "src/app/config/config";
  import Error from "src/lib/infraestructure/presentation/components/misc/Error.svelte";
  import { onMount } from "svelte";

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  const endDate = new Date();

  let hidden = true;

  export let pred;

  onMount(() => {
    setTimeout(() => {
      hidden = false;
    }, 500);
  });
</script>

<section>
  <div>
    {#if hidden}
      <Loading />
    {:else}
      <WeatherCard class="child">
        <div slot="header" class="header">
          <i class="fi fi-rr-cloud-showers-heavy" />
          <p class="m-0 text-sm">Precipitaciones (Últimos 7 días)</p>
        </div>
        <div
          slot="body"
          class="body"
          style="max-height: 200px; min-height: 100px;"
        >
          <BarChart
            data={[22.1, 12.12, 43.1, 12.1, 12.1, 0.0, 12.9, 0.0]}
            labels={[
              "2021-05-01",
              "2021-05-02",
              "2021-05-03",
              "2021-05-04",
              "2021-05-05",
              "2021-05-06",
              "2021-05-07",
              "2021-05-08",
            ]}
            color="blue"
            yAxisLabel="Precipitación (mm)"
          />
        </div>
      </WeatherCard>
    {/if}
    <WeatherCard class="child">
      <div slot="header" class="header">
        <i class="fi fi-rr-wind" />
        <p class="m-0 text-sm">Viento</p>
      </div>
      <div slot="body" class="body">
        <img
          src="/images/compass.svg"
          alt="wind direction"
          height="100"
          width="100"
        />
        <p class="text-m m-0"><strong>{pred.wind[0].speed} km/h</strong></p>
      </div>
    </WeatherCard>
    <WeatherCard class="child">
      <div slot="header" class="header">
        <i class="fi fi-rr-sun" />
        <p class="m-0 text-sm">UV</p>
      </div>
      <div slot="body" class="body">
        <br />
        <input type="range" class="slider" min="0" max="10" value="1" />
        <p class="text-m m-0"><strong>1</strong></p>
      </div></WeatherCard
    >
    <WeatherCard class="child">
      <div slot="header" class="header">
        <i class="fi fi-rr-temperature-high" />
        <p class="m-0 text-sm">Temperatura</p>
      </div>
      <div slot="body" class="body">
        <div style="max-height: 250px; min-height: 150px; width: 100%;">
          <LineChart
            labels={pred.ta.map((ta) => ta.period)}
            datasets={[
              {
                data: pred.ta.map((ta) => ta.value),
                label: "",
                fill: true,
                backgroundColor: function (context) {
                  const chart = context.chart;
                  const { ctx, chartArea } = chart;
                  if (!chartArea) {
                    return null;
                  }
                  const gradient = ctx.createLinearGradient(
                    0,
                    chartArea.bottom,
                    0,
                    chartArea.top
                  );
                  gradient.addColorStop(0, "#267DF3");
                  gradient.addColorStop(0.6, "#F34A26");
                  return gradient;
                },
                borderWidth: 3,
                borderColor: "#2F3030",
                tension: 0.2,
              },
            ]}
            {config}
          />
        </div>
        <div class="temp__min__max">
          <p class="text-sm m-0">
            <strong>Min: {Math.min(...pred.ta.map((ta) => ta.value))} °C</strong
            >
          </p>
          <p class="text-sm m-0">
            <strong>Max: {Math.max(...pred.ta.map((ta) => ta.value))} °C</strong
            >
          </p>
        </div>
      </div>
    </WeatherCard>
  </div>
</section>

<style lang="scss">
  section {
    grid-area: weather-stats;
  }

  section > div {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .header {
    display: flex;
    flex-direction: row;
    column-gap: 0.75rem;

    p {
      color: rgb(78, 78, 78);
    }
  }

  .temp__min__max {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    column-gap: 1rem;
  }

  .body {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    row-gap: 0.5rem;
  }

  :global(.child:first-child) {
    width: 100%;
  }

  :global(.child:not(:first-child)) {
    flex: 1 0 auto;
    min-width: 150px;
  }

  :global(.child:last-child) {
    flex: auto;
    width: 100%;
  }

  .slider {
    -webkit-appearance: none;
    height: 15px;
    border-radius: 5px;
    background: linear-gradient(
      90deg,
      rgba(255, 0, 0, 1) 0%,
      rgba(255, 154, 0, 1) 10%,
      rgba(208, 222, 33, 1) 20%,
      rgba(79, 220, 74, 1) 30%,
      rgba(63, 218, 216, 1) 40%,
      rgba(47, 201, 226, 1) 50%,
      rgba(28, 127, 238, 1) 60%,
      rgba(95, 21, 242, 1) 70%,
      rgba(186, 12, 248, 1) 80%,
      rgba(251, 7, 217, 1) 90%,
      rgba(255, 0, 0, 1) 100%
    );
    outline: none;
    width: 100%;
  }
</style>
