<script>
  import LineChart from "src/lib/infraestructure/presentation/components/charts/LineChart.svelte";
  import CropStatsCard from "../components/CropStatsCard.svelte";
  import config from "../config/selectedCropStat.config";
  import Card from "src/lib/infraestructure/presentation/components/cards/Card.svelte";
  import Error from "src/lib/infraestructure/presentation/components/misc/Error.svelte";
  import Loading from "src/lib/infraestructure/presentation/components/misc/Loading.svelte";
  import { parcelsService } from "src/app/config/config";

  let selectedCropStat = {};
  export let enclosureId;
</script>

<section>
  <div class="crop__stats__wrapper">
    {#await parcelsService.getCropStats(enclosureId)}
      <Loading />
    {:then cropStats}
      {#each cropStats as cropStat}
        <button on:click={() => (selectedCropStat = cropStat)}>
          <CropStatsCard
            title={cropStat.title}
            value={cropStat.value}
            unit={cropStat.unit}
            diff={cropStat.diff}
            datasets={cropStat.datasets}
            labels={cropStat.labels}
            primary={selectedCropStat.title === cropStat.title}
          />
        </button>
      {/each}
    {:catch}
      <Error />
    {/await}
  </div>
  <br />
  <Card class="chart__wrapper">
    <div slot="body" class="chart">
      <LineChart
        labels={selectedCropStat.labels}
        datasets={[
          {
            label: "",
            data: selectedCropStat.datasets,
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
              gradient.addColorStop(0, "rgba(255,255,255,0.7)");
              gradient.addColorStop(0.6, "rgba(252, 155, 104,1)");
              return gradient;
            },
            borderWidth: 3,
            borderColor: "#414242",
            tension: 0.2,
          },
        ]}
        title="{selectedCropStat?.title || ''} ({selectedCropStat?.unit ||
          ''}) por fecha"
        {config}
      />
    </div>
  </Card>
</section>

<style>
  .crop__stats__wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .chart {
    height: 300px;
  }

  button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }
</style>
