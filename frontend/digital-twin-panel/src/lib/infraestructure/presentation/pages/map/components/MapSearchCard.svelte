<script lang="ts">
  import CardInner from "../../../components/cards/CardInner.svelte";
  import Range from "../../../components/misc/Range.svelte";
  import geojson2svg from "geojson-to-svg";
  import { onMount } from "svelte";
  import { getRangeBarColor, numberWithCommas } from "src/lib/core/functions";
  import { enclosuresService } from "src/app/config/config";
  import Loading from "../../../components/misc/Loading.svelte";
  import Error from "../../../components/misc/Error.svelte";

  export let enclosureName: string = "--";
  export let location: string = "--";
  export let area: number | string = "--";
  export let geojsonFeature: any;
  export let color: string;
  export let cropName: string = "--";

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
      // Replace the svg tag with a svg tag with the desired width and height and add border color black adapted to the shape
      .replace("svg", "svg width='125' height='125'");
  });
</script>

<CardInner>
  <div slot="body" class="body">
    {@html icon}
    <div class="content">
      <p class="text-sm m-0"><strong>{enclosureName}</strong></p>
      <p class="text-xs mb-4">{location}</p>
      <div class="card-item">
        <i class="fi fi-rr-map-marker" />
        <p class="text-sm m-0 pl-8">{numberWithCommas(area)}</p>
      </div>
      <div class="card-item">
        <i class="fi fi-rr-corn" />
        <slot name="crops" />
        <p class="text-xs m-0">{cropName}</p>
      </div>
      <div class="card-item">
        <i class="fi fi-rr-heart" />
        {#await enclosuresService.getNDVI([enclosureName], null, null, 1)}
          <Loading />
        {:then ndvi}
          {@const ndviVal = ndvi?.at(0).value}
          <Range
            value={ndviVal}
            to={1}
            height={12}
            background={getRangeBarColor(ndviVal)}
          />
          <p class="text-sm m-0">
            <strong>{numberWithCommas(ndviVal)}</strong>
          </p>
        {:catch}
          <Error />
        {/await}
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
    gap: 1rem;

    .content {
      flex: 1;
    }
    .card-item {
      display: flex;
      flex-direction: row;
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
