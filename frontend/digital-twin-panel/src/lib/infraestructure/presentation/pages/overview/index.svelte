<script lang="ts">
  import { parcelsService } from "src/app/config/config";
  import AverageCharacteristics from "./sections/AverageCharacteristics.svelte";
  import Map from "./sections/Map.svelte";
  import RangeCharacteristics from "./sections/RangeCharacteristics.svelte";
  import Summary from "./sections/Summary.svelte";
  import Tables from "./sections/Tables.svelte";
</script>

<h1 class="title">Overview</h1>
<div class="overview mr-8 container-responsive">
  {#await parcelsService.getEnclosures([])}
    <div>loading...</div>
  {:then parcels}
    <Summary />
    <AverageCharacteristics />
    <RangeCharacteristics />
    <Map {parcels} />
    <Tables />
  {:catch error}
    <div>{error.message}</div>
  {/await}
</div>

<style lang="scss">
  .overview {
    display: grid;
    gap: 0.75rem;
    grid-template-areas:
      "map"
      "avgCharacteristics"
      "rangeCharacteristics"
      "tables";
    :global(.summary) {
      display: none;
    }
  }

  @include media(">large") {
    .overview {
      grid-template-columns: 2.5fr 2.5fr 2fr;
      grid-template-areas:
        "map avgCharacteristics summary"
        "rangeCharacteristics avgCharacteristics summary"
        "tables tables summary";
      :global(.summary) {
        display: block;
      }
    }
    :global(.cupertino-pane-wrapper) {
      display: none !important;
    }
  }
</style>
