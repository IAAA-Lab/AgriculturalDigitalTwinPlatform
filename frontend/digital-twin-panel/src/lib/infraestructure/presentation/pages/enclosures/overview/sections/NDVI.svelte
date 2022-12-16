<script>
  import { map } from "leaflet";
  import { getRangeBarColor } from "src/lib/core/functions";
  import Card from "src/lib/infraestructure/presentation/components/cards/Card.svelte";
  import CardInner from "src/lib/infraestructure/presentation/components/cards/CardInner.svelte";
  import LineChart from "src/lib/infraestructure/presentation/components/charts/LineChart.svelte";
  import Range from "src/lib/infraestructure/presentation/components/misc/Range.svelte";
  import { Link } from "svelte-routing";
  import config from "../../map/components/config/ndviLineChart.config";
  import Error from "src/lib/infraestructure/presentation/components/misc/Error.svelte";
  import Loading from "src/lib/infraestructure/presentation/components/misc/Loading.svelte";
  import { parcelsService } from "src/app/config/config";

  export let enclosureId;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  const endDate = new Date();
</script>

<section>
  {#await parcelsService.getNDVI([enclosureId], startDate, endDate)}
    <Loading />
  {:then ndviValues}
    <Link to="/enclosure/{enclosureId}/map">
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
                <strong
                  >{(currentNdviValue * 100).toPrecision(4)} %<strong /></strong
                >
              </h3>
            </div>
          </CardInner>
          <br />
          <CardInner>
            <div class="ndvi__chart" slot="body">
              <LineChart
                labels={ndviValues.map((ndvi) => ndvi.date)}
                datasets={[
                  {
                    data: ndviValues.map((ndvi) => ndvi.value),
                    label: "Ganancias",
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
                      gradient.addColorStop(0.0, "rgba(255,255,255,0.7)");
                      gradient.addColorStop(0.2, "rgba(252, 155, 104,1)");
                      return gradient;
                    },
                    borderColor: "rgba(252, 155, 104,1)",
                    tension: 0.2,
                  },
                ]}
                title="Índices NDVI (Últimos 30 días)"
                {config}
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
    height: 200px;
  }

  .ndvi__value__unit {
    display: flex;
    justify-content: space-between;
    align-items: center;
    white-space: nowrap;
    column-gap: 0.5rem;
  }
</style>
