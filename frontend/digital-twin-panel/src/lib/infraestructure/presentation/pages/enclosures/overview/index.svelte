<script>
  import Map from "./sections/Map.svelte";
  import Characteristics from "./sections/Characteristics.svelte";
  import Crops from "./sections/Crops.svelte";
  import Ndvi from "./sections/NDVI.svelte";
  import { enclosuresService } from "src/app/config/config";
  import CurrentWeather from "./sections/CurrentWeather/index.svelte";
  import UsedArea from "./sections/UsedArea.svelte";
  import { selectedEnclosure } from "src/app/config/stores/selectedEnclosure";
  import ProtectedAreaCard from "./components/ProtectedAreaCard.svelte";
  import Loading from "../../../components/misc/Loading.svelte";
  import Error from "../../../components/misc/Error.svelte";

  export let id;
  // Set enclosure id to store (global state) in memory
  let vulnerableArea = true;
  $: $selectedEnclosure = id;
</script>

<div class="container-responsive">
  <div class="title">
    <h1>Recinto#{id}</h1>
    {#if vulnerableArea}
      <ProtectedAreaCard />
    {/if}
  </div>
  <div class="overview">
    {#await enclosuresService.getEnclosures([id])}
      <Loading />
    {:then enclosures}
      {@const properties = enclosures[0].properties}
      <Map {enclosures} />
      <Crops enclosureId={id} crop={properties.crop} />
      <Characteristics {properties} />
      <!-- <UsedArea usedArea={properties.area} totalArea={properties.areaSIGPAC} /> -->
      <Ndvi enclosureId={id} />
      <CurrentWeather enclosureId={id} />
    {:catch error}
      <Error errorMessage={error.message} />
    {/await}
  </div>
</div>

<style lang="scss">
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 1rem;
  }
  .overview {
    display: grid;
    gap: 0.75rem;
    grid-template-areas:
      "map"
      "crops"
      "characteristics"
      "ndvi"
      "weather";

    .weather {
      display: none;
    }
  }

  @include media(">large") {
    .overview {
      grid-template-columns: 1.5fr 0.7fr 0.9fr;
      grid-template-rows: 0fr 0.5fr 1fr;
      grid-template-areas:
        "map characteristics characteristics"
        "map crops weather"
        "ndvi ndvi weather";

      :global(.summary) {
        display: block;
      }
    }
  }
</style>
