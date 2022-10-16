<script>
  import AverageCharacteristics from "./sections/AverageCharacteristics.svelte";
  import Map from "./sections/Map.svelte";
  import RangeCharacteristics from "./sections/RangeCharacteristics.svelte";
  import Summary from "./sections/Summary.svelte";
  import Tables from "./sections/Tables.svelte";
</script>

<svelte:head>
  <title>Overview</title>
  <meta name="description" content="Overview" />
</svelte:head>

<div class="overview">
  <Map />
  <AverageCharacteristics />
  <RangeCharacteristics />
  <Summary />
  <Tables />
</div>

<style lang="scss">
  .overview {
    display: grid;
    gap: 2rem;
    grid-template-columns: auto;
    grid-template-areas:
      "map"
      "avgCharacteristics"
      "rangeCharacteristics"
      "tables"
      "summary";
    :global(.summary) {
      display: none;
    }
  }

  @include media(">medium") {
    .overview {
      grid-template-columns: 4fr 2fr;
      grid-template-areas:
        "map summary"
        "rangeCharacteristics summary"
        "avgCharacteristics summary"
        "tables summary";
      :global(.summary) {
        display: block;
      }
    }
  }

  @include media(">large") {
    .overview {
      display: grid;
      grid-template-columns: 3fr 2.5fr 2fr;
      grid-template-rows: 3fr 1fr 2fr;
      grid-template-areas:
        "map avgCharacteristics summary"
        "rangeCharacteristics avgCharacteristics summary"
        "tables tables summary";
      :global(.summary) {
        display: block;
      }
    }
  }
</style>
