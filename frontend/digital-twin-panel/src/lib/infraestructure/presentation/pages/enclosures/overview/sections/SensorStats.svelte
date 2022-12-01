<script>
  import { getIconByCharacteristic } from "src/lib/core/functions";
  import StatsCard from "../../../overview/components/StatsCard.svelte";

  export let sensorStats = [];
</script>

<section>
  {#each sensorStats as stat}
    <div class="card">
      <StatsCard
        statName={"Juan"}
        statValue={stat?.value}
        statUnit={stat?.unit}
      >
        {@html getIconByCharacteristic(stat)}
      </StatsCard>
    </div>
  {/each}
</section>

<style>
  section {
    grid-area: sensor-stats;
    display: flex;
    flex-direction: row;
    column-gap: 1rem;
    row-gap: 1rem;
    overflow-y: scroll;
  }

  .card {
    flex: 200px;
  }
</style>
