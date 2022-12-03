<script>
  import { getRangeBarColor } from "src/lib/core/functions";
  import Card from "src/lib/infraestructure/presentation/components/cards/Card.svelte";
  import CardInner from "src/lib/infraestructure/presentation/components/cards/CardInner.svelte";
  import LineChart from "src/lib/infraestructure/presentation/components/charts/LineChart.svelte";
  import Range from "src/lib/infraestructure/presentation/components/misc/Range.svelte";
</script>

<Card>
  <div slot="header">
    <h2 class="m-0">NDVI</h2>
  </div>
  <div slot="body" class="p-16 body">
    <div class="left">
      <CardInner>
        <div slot="body" class="range__bar">
          <Range value={82} to={100} background={getRangeBarColor(82)} />
          <h3 class="m-0">
            <strong>{((82 / 100) * 100).toPrecision(4)} %<strong /></strong>
          </h3>
        </div>
      </CardInner>
      <input type="date" />
    </div>
    <div class="chart__wrapper">
      <LineChart
        data={[2, 2, 2, 2, 3]}
        labels={["we", "d", "sd", "sd", "wds"]}
        color={"orange"}
      />
    </div>
  </div>
</Card>

<style>
  .body {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .left {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .chart__wrapper {
    flex: 3;
    height: 250px;
    min-width: 200px;
  }

  .range__bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    white-space: nowrap;
    column-gap: 0.5rem;
    flex-wrap: wrap;
  }
</style>
