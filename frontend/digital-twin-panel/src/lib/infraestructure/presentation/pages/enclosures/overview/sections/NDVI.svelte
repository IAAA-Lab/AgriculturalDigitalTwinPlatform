<script>
  import { getRangeBarColor, numberWithCommas } from "src/lib/core/functions";
  import Card from "src/lib/infraestructure/presentation/components/cards/Card.svelte";
  import CardInner from "src/lib/infraestructure/presentation/components/cards/CardInner.svelte";
  import LineChart from "src/lib/infraestructure/presentation/components/charts/Chart.svelte";
  import Range from "src/lib/infraestructure/presentation/components/misc/Range.svelte";
  import { Link } from "svelte-routing";
  import Error from "src/lib/infraestructure/presentation/components/misc/Error.svelte";
  import Loading from "src/lib/infraestructure/presentation/components/misc/Loading.svelte";
  import { BASEPATH, enclosuresService } from "src/app/config/config";
  import { es } from "date-fns/locale";

  export let enclosureId;
</script>

<section>
  {#await enclosuresService.getNDVI([enclosureId], null, null, 30)}
    <Loading />
  {:then ndviValues}
    <Link to="{BASEPATH}/enclosure/{enclosureId}/map">
      <Card>
        <h6 slot="header" class="m-0 mb-8">Salud de las plantas (NDVI)</h6>
        <svelte:fragment slot="body">
          {@const currentNdviValue = ndviValues.at(-1)?.value}
          <CardInner>
            <div slot="body" class="ndvi__value__unit">
              <Range
                value={currentNdviValue}
                to={1}
                background={getRangeBarColor(currentNdviValue)}
              />
              <h3 class="m-0">
                <strong>{numberWithCommas(currentNdviValue)}<strong /></strong>
              </h3>
            </div>
          </CardInner>
          <br />
          <CardInner>
            <div class="ndvi__chart" slot="body">
              <LineChart
                data={{
                  data: {
                    datasets: [
                      {
                        type: "line",
                        data: ndviValues?.map((ndvi) => ({
                          x: ndvi.date.split("T")[0],
                          y: ndvi.value,
                        })),
                        fill: true,
                        borderColor: "#fc9b68",
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
                          gradient.addColorStop(0.2, "rgba(255,255,255,0.8)");
                          gradient.addColorStop(1, "rgba(252, 155, 104,1)");
                          return gradient;
                        },
                        tension: 0.2,
                      },
                    ],
                  },
                  options: {
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        type: "linear",
                        display: true,
                        position: "left",
                        max: 1,
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
        </svelte:fragment>
      </Card>
    </Link>
  {:catch}
    <Error />
  {/await}
</section>

<style>
  section {
    grid-area: ndvi;
  }
  .ndvi__chart {
    height: 300px;
  }

  .ndvi__value__unit {
    display: flex;
    align-items: center;
    white-space: nowrap;
    column-gap: 0.5rem;
  }
</style>
