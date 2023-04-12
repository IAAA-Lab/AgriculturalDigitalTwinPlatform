<script type="ts">
  import { getRangeBarColor, numberWithCommas } from "src/lib/core/functions";
  import Card from "src/lib/infraestructure/presentation/components/cards/Card.svelte";
  import CardInner from "src/lib/infraestructure/presentation/components/cards/CardInner.svelte";
  import LineChart from "src/lib/infraestructure/presentation/components/charts/Chart.svelte";
  import Range from "src/lib/infraestructure/presentation/components/misc/Range.svelte";
  import { enclosuresService } from "src/app/config/config";
  import type { HistoricalWeather, NDVI } from "src/lib/core/Domain";
  import "chartjs-adapter-date-fns";
  import { es } from "date-fns/locale";

  export let enclosureId: string;
  export let idema: string;
  let startDateText: string = null;
  let endDateText: string = null;
  let ndviValues: NDVI[] = [];
  let weatherValues: HistoricalWeather[] = [];

  const LIMIT = 30;

  $: {
    enclosuresService
      .getNDVI(
        [enclosureId],
        startDateText && new Date(startDateText),
        endDateText && new Date(endDateText),
        startDateText && endDateText ? null : LIMIT
      )
      .then((ndvi) => {
        ndviValues = ndvi;
        enclosuresService
          .getHistoricalWeather(
            idema,
            new Date(ndvi.at(0)?.date || startDateText),
            new Date(ndvi.at(-1)?.date || endDateText)
          )
          .then((weather) => {
            weatherValues = weather;
          })
          .catch((error) => {
            weatherValues = [];
          });
      })
      .catch((error) => {
        ndviValues = [];
      });
  }
</script>

<Card>
  <div slot="body" class="p-16 body">
    <div class="left">
      <h4 class="m-0">Media</h4>
      <CardInner class="ndvi__card">
        <div slot="body" class="range__bar">
          {@const lastNdviValue = ndviValues?.at(-1)?.value}
          <Range
            value={lastNdviValue}
            to={1}
            background={getRangeBarColor(lastNdviValue)}
          />
          <h3 class="m-0">
            <strong
              >{numberWithCommas(
                ndviValues.reduce((a, b) => a + b?.value, 0) / ndviValues.length
              )}<strong /></strong
            >
          </h3>
        </div>
      </CardInner>
      <div class="date__picker">
        <input type="date" bind:value={startDateText} />
        <input type="date" bind:value={endDateText} />
      </div>
    </div>
    <CardInner class="card__wrapper">
      <div class="chart__wrapper" slot="body">
        <LineChart
          data={{
            data: {
              datasets: [
                {
                  type: "line",
                  data: ndviValues?.map((ndvi) => ({
                    x: new Date(ndvi.date),
                    y: ndvi.value,
                  })),
                  label: "ndvi",
                  fill: true,
                  borderColor: "#fc9b68",
                  backgroundColor: "transparent",
                  tension: 0.2,
                  yAxisID: "y1",
                },
                {
                  type: "bar",
                  data: weatherValues?.map((weather) => ({
                    x: new Date(weather.date),
                    y: weather.prec,
                  })),
                  label: "lluvias",
                  fill: true,
                  borderColor: "#blue",
                  backgroundColor: "blue",
                  tension: 0.2,
                  yAxisID: "y",
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  type: "linear",
                  display: true,
                  position: "left",
                  title: {
                    display: true,
                    text: "Lluvias (mm)",
                  },
                },
                y1: {
                  type: "linear",
                  display: true,
                  position: "right",
                  title: {
                    display: true,
                    text: "NDVI",
                  },
                  max: 1,
                  grid: {
                    drawOnChartArea: false,
                  },
                },
                x: {
                  display: true,
                  position: "bottom",
                  type: "time",
                  adapters: {
                    date: {
                      locale: es,
                    },
                  },
                },
              },
            },
          }}
        />
      </div>
    </CardInner>
  </div>
</Card>

<style lang="scss">
  .body {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 2rem;

    :global(.card__wrapper) {
      flex: 3;
    }
  }

  .left {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 1rem;
  }

  .range__bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    white-space: nowrap;
    column-gap: 0.5rem;
  }

  :global(.ndvi__card) {
    width: 100%;
  }

  .chart__wrapper {
    min-height: 200px;
    max-height: 100%;
    min-width: 200px;
  }

  .date__picker {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
</style>
