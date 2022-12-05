<script>
  import { map } from "leaflet";
  import { getRangeBarColor } from "src/lib/core/functions";
  import Card from "src/lib/infraestructure/presentation/components/cards/Card.svelte";
  import CardInner from "src/lib/infraestructure/presentation/components/cards/CardInner.svelte";
  import LineChart from "src/lib/infraestructure/presentation/components/charts/LineChart.svelte";
  import Range from "src/lib/infraestructure/presentation/components/misc/Range.svelte";
  import { Link } from "svelte-routing";
  import config from "src/lib/infraestructure/presentation/components/charts/config/LineChart.config";

  export let ndviValues = [];
</script>

<section>
  <Link to="/enclosure/1/map">
    <Card>
      <h6 slot="header" class="m-0 mb-8">Salud de las plantas (NDVI)</h6>
      <svelte:fragment slot="body">
        {@const currentNdviValue = ndviValues.at(-1)?.value}
        <CardInner>
          <div slot="body" class="ndvi__value__unit">
            <Range
              value={currentNdviValue}
              to={100}
              background={getRangeBarColor(currentNdviValue)}
            />
            <h3 class="m-0"><strong>{currentNdviValue} %<strong /></strong></h3>
          </div>
        </CardInner>
        <br />
        <CardInner>
          <div class="ndvi__chart" slot="body">
            <LineChart
              labels={[
                "20-10-2020",
                "21-10-2020",
                "22-10-2020",
                "23-10-2020",
                "24-10-2020",
                "25-10-2020",
                "26-10-2020",
              ]}
              datasets={[
                {
                  data: [11, 20, 23, 2, 31, 2, 44, 23, 2],
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
                    gradient.addColorStop(0, "rgb(204, 219, 240, 0.7)");
                    gradient.addColorStop(0.8, "rgba(22, 22, 104,1)");
                    return gradient;
                  },
                  tension: 0.2,
                },
              ]}
              {config}
            />
          </div>
        </CardInner>
      </svelte:fragment>
    </Card>
  </Link>
</section>

<style>
  section {
    grid-area: ndvi;
  }
  .ndvi__chart {
    height: 150px;
  }

  .ndvi__value__unit {
    display: flex;
    justify-content: space-between;
    align-items: center;
    white-space: nowrap;
    column-gap: 0.5rem;
  }
</style>
