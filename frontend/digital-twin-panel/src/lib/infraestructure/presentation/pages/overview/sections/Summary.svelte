<script lang="ts">
  import Card from "../../../components/cards/Card.svelte";
  import CardInner from "../../../components/cards/CardInner.svelte";
  import PieChart from "../../../components/charts/DoughnutChart.svelte";
  import ToggleSwitch from "../../../components/basics/ToggleSwitch.svelte";
  import SummaryStatCard from "../components/SummaryStatCard.svelte";
  import { parcelsService } from "src/app/config/config";

  let checked: boolean = false;
  let selectedChartStat: string;
</script>

<section class="summary">
  {#await parcelsService.getOverviewSummary("")}
    <div>loading...</div>
  {:then summary}
    {@const statsSelected = checked ? summary.stats.bad : summary.stats.good}
    <Card>
      <div slot="header" class="pl-8">
        <div class="title mt-8">
          <h2 class="m-0">Resumen</h2>
          <ToggleSwitch bind:checked />
        </div>
        <p class="text-xs">Última actualización: 2021-03-01 12:00</p>
      </div>
      <div slot="body" class="body">
        <div class="body-stats mb-16">
          {#each statsSelected as stat, i}
            <SummaryStatCard
              title={stat.stat.name}
              value={stat.stat.value}
              unit={stat.stat.unit || ""}
              diff={stat.diff}
              enclosureName={stat.enclosureId}
              primary={i === 0}
            />
          {/each}
        </div>
        <CardInner>
          <div slot="header">
            <h4 class="text-sm stat-header m-0">Stats promedios por parcela</h4>
            <select bind:value={selectedChartStat}>
              {#each [...new Set(summary.stats.all.map((s) => s.stat.name))] as statName}
                <option value={statName}>{statName}</option>
              {/each}
            </select>
          </div>
          <div slot="body" class="analytics-chart">
            <PieChart
              labels={summary.stats.all
                .filter((s) => s.stat.name === selectedChartStat)
                .map((s) => s.enclosureId)}
              data={summary.stats.all
                .filter((s) => s.stat.name === selectedChartStat)
                .map((s) => s.stat.value)}
            />
          </div>
        </CardInner>
      </div>
    </Card>
  {:catch error}
    <div>{error}</div>
  {/await}
</section>

<style lang="scss">
  .summary {
    grid-area: summary;

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .body {
      padding: 0px 5px 10px 5px;
    }
    .body-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      grid-gap: 0.75rem;
    }

    .analytics-chart {
      max-height: 175px;
      padding: 5px;
    }
  }
</style>
