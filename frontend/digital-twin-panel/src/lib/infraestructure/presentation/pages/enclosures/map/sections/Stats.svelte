<script>
  import { getRangeBarColor } from "src/lib/core/functions";
  import Card from "src/lib/infraestructure/presentation/components/cards/Card.svelte";
  import CardInner from "src/lib/infraestructure/presentation/components/cards/CardInner.svelte";
  import LineChart from "src/lib/infraestructure/presentation/components/charts/LineChart.svelte";
  import Range from "src/lib/infraestructure/presentation/components/misc/Range.svelte";
  import config from "../components/config/ndviLineChart.config";
  import { parcelsService } from "src/app/config/config";
  import Loading from "src/lib/infraestructure/presentation/components/misc/Loading.svelte";
  import Error from "src/lib/infraestructure/presentation/components/misc/Error.svelte";

  export let enclosureId;
  let endDateText = new Date().toISOString().split("T")[0];
  let startDateText;
  startDateText = new Date(new Date().setDate(new Date().getDate() - 30))
    .toISOString()
    .split("T")[0];
  let startDate;
  let endDate;
  $: {
    startDate = new Date(startDateText);
    endDate = new Date(endDateText);
  }
</script>

{#await parcelsService.getNDVI([enclosureId], startDate, endDate)}
  <Loading />
{:then ndviValues}
  <Card>
    <h2 class="m-0" slot="header">NDVI</h2>
    <div slot="body" class="p-16 body">
      <div class="left">
        <h4 class="m-0">Media</h4>
        <CardInner class="ndvi__card">
          <div slot="body" class="range__bar">
            {@const lastNdviValue = ndviValues.at(-1).value}
            <Range
              value={lastNdviValue}
              to={1}
              background={getRangeBarColor(lastNdviValue)}
            />
            <h3 class="m-0">
              <strong
                >{(
                  (ndviValues.reduce((a, b) => a + b.value, 0) /
                    ndviValues.length) *
                  100
                ).toPrecision(4)} %<strong /></strong
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
            labels={ndviValues.map((v) => v.date)}
            datasets={[
              {
                data: ndviValues.map((v) => v.value),
                label: "Ganancias",
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
                  gradient.addColorStop(0.0, "rgba(255,255,255,0.7)");
                  gradient.addColorStop(0.2, "rgba(252, 155, 104,1)");
                  return gradient;
                },
                tension: 0.2,
              },
            ]}
            title="Índices NDVI por fecha"
            {config}
          />
        </div>
      </CardInner>
    </div>
  </Card>
{:catch error}
  <Error />
{/await}

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
    height: 300px;
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
