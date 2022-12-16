<script lang="ts">
  import { IMAGES_SERVER_URL } from "src/app/config/config";
  import type { CropId } from "src/lib/core/Domain";
  import { getIconByCropStats } from "src/lib/core/functions";
  import CardInner from "src/lib/infraestructure/presentation/components/cards/CardInner.svelte";

  export let crop: CropId;
  export let cropStats: any[];
</script>

<CardInner>
  <div slot="body" class="crop">
    <div class="crop__header">
      <img
        src={`${IMAGES_SERVER_URL}/pistachio.png`}
        alt="crop"
        class="crop__image"
        style="max-width: 100px;"
      />
      <h4 class="m-0">PISTACHO</h4>
      <span class="text-xs">{crop.variety}</span>
    </div>
    <div class="crop__divider" />
    <div class="crop__body">
      {#each cropStats as stat}
        <div class="crop__body__item">
          {@html getIconByCropStats(stat.title)}
          <span class="text-xs m-0">{stat.value} {stat.unit || ""} </span>
        </div>
      {/each}
    </div>
  </div>
</CardInner>

<style>
  .crop {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0.5rem;
    column-gap: 0.5rem;
  }
  .crop__header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 0.25rem;
    text-transform: uppercase;
  }

  .crop__body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    row-gap: 0.2rem;
  }

  .crop__body__item {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    column-gap: 0.5rem;
  }

  .crop__divider {
    width: 1.75px;
    height: 100px;
    background: #e3e3e3;
    border-radius: 10px;
  }
</style>
