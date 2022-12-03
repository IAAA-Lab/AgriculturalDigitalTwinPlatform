<script>
  import CardInner from "src/lib/infraestructure/presentation/components/cards/CardInner.svelte";
  import LineChart from "src/lib/infraestructure/presentation/components/charts/LineChart.svelte";
  import CropStatsCard from "../components/CropStatsCard.svelte";
</script>

<section>
  <div class="crop__stats__wrapper">
    <CropStatsCard
      primary
      title={"Ganancias"}
      unit="€"
      value={23456}
      diff={0.34}
    />
    <CropStatsCard title={"Producción"} unit="Kg" value={365343} diff={-0.72} />
    <CropStatsCard title={"Ganancias"} value={365343} diff={0.34} />
    <CropStatsCard title={"Ganancias"} value={365343} diff={0.34} />
  </div>
  <br />
  <CardInner class="chart__wrapper">
    <div slot="body" class="chart">
      <LineChart
        data={[2, 2, 2, 2, 3]}
        labels={["we", "d", "sd", "sd", "wds"]}
        color={"orange"}
      />
    </div>
  </CardInner>
</section>

<style>
  .crop__stats__wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  .chart {
    height: 300px;
  }
</style>
