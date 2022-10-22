<script lang="ts">
  import CardInner from "../cards/CardInner.svelte";
  import Range from "./Range.svelte";
  import geojson2svg from "geojson-to-svg";
  import { onMount } from "svelte";
  import RangeCharacteristics from "../../pages/overview/sections/RangeCharacteristics.svelte";
  import { numberWithCommas } from "@/src/lib/core/utils";

  export let enclosureName: string;
  export let area: number;
  export let ndvi: number;
  export let geojsonFeature: any;
  export let color: string;

  let icon = null;

  onMount(() => {
    // Convert geojson features to the svg image we see, imitating the ones in the map
    icon = geojson2svg()
      .data(geojsonFeature)
      .styles((e, i, a) => {
        return {
          fill: color,
          opacity: 0.7,
        };
      })
      .render()
      .replace("svg", "svg width='75px' height='75px'");
  });
</script>

<CardInner>
  <div slot="body" class="body">
    {@html icon}
    <div class="content">
      <p class="text-sm mb-4"><strong>{enclosureName}</strong></p>
      <div class="row">
        <i class="fi fi-rr-map-marker" />
        <p class="text-sm m-0 pl-8">{numberWithCommas(area)} Ha</p>
      </div>
      <div class="row">
        <i class="fi fi-rr-corn" />
        <slot name="crops" />
      </div>
      <div class="ndvi">
        <i class="fi fi-rr-heart" />
        <Range value={ndvi} height={12} />
        <p class="text-sm m-0"><strong>{ndvi} %</strong></p>
      </div>
    </div>
  </div>
</CardInner>

<style lang="scss">
  .body {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 0.5rem;

    .content {
      flex: 1;
    }

    .ndvi {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;

      p {
        white-space: nowrap;
      }
    }

    :global(svg) {
      transform: rotate(180deg) scaleX(-1);
    }
  }
</style>
