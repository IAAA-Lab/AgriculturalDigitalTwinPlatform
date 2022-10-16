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
    padding-right: 15px;
    padding-bottom: 15px;
    display: grid;
    gap: 1rem;
    grid-template-columns: 3fr 2.5fr 2fr;
    grid-template-rows: 3fr 2fr 3fr;
    grid-template-areas:
      "map avgCharacteristics summary"
      "rangeCharacteristics avgCharacteristics summary"
      "tables tables summary";
  }

  @include media("<medium") {
    .overview {
      gap: 0.5rem;
      grid-template-areas:
        "map"
        "avgCharacteristics"
        "rangeCharacteristics"
        "tables"
        "summary";
    }
  }
</style>
