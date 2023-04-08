<script>
  import { getIconByCharacteristic } from "src/lib/core/functions";
  import StatsCard from "../../../overview/components/StatsCard.svelte";

  export let properties = {};

  let chars = [];
  if (properties) {
    chars = [
      {
        name: "Área",
        value: properties.area,
        unit: "Ha",
      },
      {
        name: "Área SIGPAC",
        value: properties.areaSIGPAC,
        unit: "Ha",
      },
      {
        name: "Nº árboles",
        value: properties.numberOfTrees,
      },
      {
        name: "Densidad de árboles",
        value: properties.plantationDensity,
      },
      {
        name: "Uso SIGPAC",
        value: properties.parcelUse,
      },
    ];
  }
</script>

<div class="characteristics">
  {#each chars as c}
    <div class="card">
      <StatsCard statName={c?.name} statValue={c?.value} statUnit={c?.unit}>
        {@html getIconByCharacteristic(c)}
      </StatsCard>
    </div>
  {/each}
</div>

<style>
  .characteristics {
    grid-area: characteristics;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    column-gap: 0.5rem;
    row-gap: 0.5rem;
  }
</style>
