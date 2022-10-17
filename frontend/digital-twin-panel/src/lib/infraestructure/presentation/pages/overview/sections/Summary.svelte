<script>
  import Card from "../../../components/cards/Card.svelte";
  import CardInner from "../../../components/cards/CardInner.svelte";
  import SummaryStatCard from "../../../components/cards/SummaryStatCard.svelte";
  import PieChart from "../../../components/charts/PieChart.svelte";
  import ToggleSwitch from "../../../components/misc/ToggleSwitch.svelte";

  const data = {
    best: [
      {
        title: "Ganancias",
        value: 23543,
        unit: "€",
        diff: 0.24,
        enclosureName: "#20-123-23-3-4-1",
      },
      {
        title: "Producción",
        value: 2345,
        unit: "Kg",
        diff: 1.34,
        enclosureName: "#234-123-22-3-4-1",
      },
      {
        title: "Rendimiento",
        value: 1456,
        unit: "Kg/Ha",
        diff: 0.86,
        enclosureName: "#43-12-23-3-4-4",
      },
      {
        title: "NDVI",
        value: 90,
        diff: 0.11,
        enclosureName: "#5-123-23-4-4-9",
      },
    ],
    worse: [
      {
        title: "Ganancias",
        value: 124,
        unit: "€",
        diff: -0.44,
        enclosureName: "#34-11-23-3-4-12",
      },
      {
        title: "Producción",
        value: 872,
        unit: "Kg",
        diff: -1.34,
        enclosureName: "#234-123-22-3-4-1",
      },
      {
        title: "Rendimiento",
        value: 98,
        unit: "Kg/Ha",
        diff: -0.91,
        enclosureName: "#43-12-23-3-4-4",
      },
      {
        title: "NDVI",
        value: 13,
        diff: 0.24,
        enclosureName: "#5-123-23-4-4-7",
      },
    ],
  };

  let checked;
</script>

<div class="summary">
  <Card>
    <div slot="header" class="pl-8">
      <div class="title mt-8">
        <h2 class="m-0">Resumen</h2>
        <ToggleSwitch bind:checked />
      </div>
      <p class="text-xs">Última actualización: 2021-03-01 12:00</p>
    </div>
    <div slot="body" class="summary-body">
      <div class="summary-body-stats mb-16">
        {#each checked ? data.worse : data.best as stat, i}
          <SummaryStatCard
            title={stat.title}
            value={stat.value}
            unit={stat.unit || ""}
            diff={stat.diff}
            enclosureName={stat.enclosureName}
            primary={i === 0}
          />
        {/each}
      </div>
      <CardInner>
        <div slot="header">
          <h4 class="text-sm stat-header m-0">Stats promedios por parcela</h4>
          <select>
            <option value="1">NDVI</option>
            <option value="2">Temperatura</option>
            <option value="3">Parcela 3</option>
          </select>
        </div>
        <div slot="body" class="summary-analytics-chart">
          <PieChart
            labels={[
              "#20-123-23-3-4-1",
              "#20-123-23-3-4-2",
              "#20-123-23-3-4-3",
            ]}
            data={[34, 23, 43]}
          />
        </div>
      </CardInner>
    </div>
  </Card>
</div>

<style lang="scss">
  .summary {
    grid-area: summary;

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .summary-body {
      padding: 0px 5px 10px 5px;
    }
    .summary-body-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      grid-gap: 0.75rem;
    }

    .summary-analytics-chart {
      max-height: 175px;
      padding: 5px;
    }
  }
</style>
