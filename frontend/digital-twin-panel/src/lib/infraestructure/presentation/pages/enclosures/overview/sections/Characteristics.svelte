<script>
  import { getIconByCharacteristic } from "src/lib/core/functions";
  import StatsCard from "../../../overview/components/StatsCard.svelte";

  export let sensorStats = [];
</script>

<div class="sensor-stats">
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
</div>

<style>
  .sensor-stats {
    grid-area: characteristics;
    display: flex;
    flex-direction: row;
    column-gap: 1rem;
    overflow-y: scroll;
  }

  .card {
    flex: 200px;
  }
</style>
