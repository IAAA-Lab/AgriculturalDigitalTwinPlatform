<script lang="ts">
  import Card from "../../../components/cards/Card.svelte";
  import CardInner from "../../../components/cards/CardInner.svelte";
  import PieChart from "../../../components/charts/DoughnutChart.svelte";
  import ToggleSwitch from "../../../components/basics/ToggleSwitch.svelte";
  import SummaryStatCard from "../components/SummaryStatCard.svelte";
  import { enclosuresService } from "src/app/config/config";
  import { Link } from "svelte-routing";
  import { formattedDate } from "src/lib/core/functions";
  import Loading from "../../../components/misc/Loading.svelte";
  import Error from "../../../components/misc/Error.svelte";

  let checked: boolean = false;
  let selectedChartStat: string;
  let statsSelected: any[] = [];
</script>

<section class="summary">
  <Card>
    <svelte:fragment slot="header">
      <div class="summary__title mt-8">
        <h2 class="m-0">Resumen</h2>
        <ToggleSwitch bind:checked />
      </div>
      <p class="text-xs">Última actualización: --</p>
    </svelte:fragment>
    <div slot="body" class="body">
      <div class="body-stats mb-16">
        {#each statsSelected as stat, i}
          <Link to={`/enclosure/${stat.enclosureId}`}>
            <SummaryStatCard
              title={stat.stat.name}
              value={stat.stat.value}
              unit={stat.stat.unit || ""}
              diff={stat.diff}
              enclosureName={stat.enclosureId}
              crops={stat.cropIds}
              primary={i === 0}
            />
          </Link>
        {/each}
      </div>
      <CardInner>
        <!-- <svelte:fragment slot="header">
          <div class="header__wrapper">
            <h4 class="text-sm stat-header m-0 mr-16">
              Stats promedios por parcela
            </h4>
            <select bind:value={selectedChartStat}>
              {#each [...new Set(summary?.stats.all.map((s) => s.stat.name))] as statName}
                <option value={statName}>{statName}</option>
              {/each}
            </select>
          </div>
        </svelte:fragment> -->
        <div slot="body" class="analytics-chart">
          <!-- <PieChart
            labels={summary?.stats.all
              .filter((s) => s.stat.name === selectedChartStat)
              .map((s) => s.enclosureId)}
            data={summary?.stats.all
              .filter((s) => s.stat.name === selectedChartStat)
              .map((s) => s.stat.value)}
          /> -->
          <h3 class="m-0">En construcción</h3>
          <br />
          <img
            src="/images/under_construction.png"
            alt="Under construction"
            width="100%"
            style="max-width: 700px;"
          />
        </div>
      </CardInner>
    </div>
  </Card>
</section>

<style lang="scss">
  .summary {
    grid-area: summary;

    .header__wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .summary__title {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .body {
      height: 700px;
      padding: 0px 5px 10px 5px;
    }
    .body-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      grid-gap: 0.75rem;
    }

    .analytics-chart {
      // max-height: 175px;
      padding: 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
</style>
