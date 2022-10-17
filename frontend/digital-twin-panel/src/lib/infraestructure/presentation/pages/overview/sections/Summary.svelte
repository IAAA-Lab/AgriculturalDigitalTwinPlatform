<script>
  import Card from "../../../components/cards/Card.svelte";
  import CardInner from "../../../components/cards/CardInner.svelte";
  import SummaryStatCard from "../../../components/cards/SummaryStatCard.svelte";
  import PieChart from "../../../components/charts/PieChart.svelte";
</script>

<div class="summary">
  <Card>
    <div slot="header" class="pl-8">
      <h2 class="m-0 mt-8">Resumen</h2>
      <p class="text-xs">Última actualización: 2021-03-01 12:00</p>
    </div>
    <div slot="body" class="summary-body">
      <div class="summary-body-stats mb-16">
        <SummaryStatCard
          title="Ganancias"
          value={23543}
          unit="€"
          diff={0.24}
          enclosureName="#20-123-23-3-4-1"
          primary
        />
        <SummaryStatCard
          title="Producción"
          value={2345}
          unit="Kg"
          diff={1.34}
          enclosureName="#20-123-23-3-4-1"
        />
        <SummaryStatCard
          title="Rendimiento"
          value={1456}
          unit="Kg/Ha"
          diff={0.86}
          enclosureName="#20-123-23-3-4-3"
        />
        <SummaryStatCard
          title="NDVI"
          value={90}
          diff={0.54}
          enclosureName="#20-13-23-3-4-3"
        />
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
    }
  }
</style>
