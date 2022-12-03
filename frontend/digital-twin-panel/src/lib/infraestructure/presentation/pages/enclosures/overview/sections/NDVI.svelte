<script>
  import { map } from "leaflet";
  import { getRangeBarColor } from "src/lib/core/functions";
  import Card from "src/lib/infraestructure/presentation/components/cards/Card.svelte";
  import CardInner from "src/lib/infraestructure/presentation/components/cards/CardInner.svelte";
  import LineChart from "src/lib/infraestructure/presentation/components/charts/LineChart.svelte";
  import Range from "src/lib/infraestructure/presentation/components/misc/Range.svelte";
  import { Link } from "svelte-routing";
  export let ndviValues = [];
</script>

<section>
  <Link to="/enclosure/1/map">
    <Card>
      <h6 slot="header" class="m-0 mb-8">Salud de las plantas (NDVI)</h6>
      <div slot="body">
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
              data={ndviValues.map((e) => e.value)}
              labels={ndviValues.map((e) => e.date)}
              color="orange"
            />
          </div>
        </CardInner>
      </div>
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
