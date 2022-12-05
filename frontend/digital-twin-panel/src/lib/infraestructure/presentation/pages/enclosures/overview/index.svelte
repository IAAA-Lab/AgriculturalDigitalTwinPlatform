<script>
  import Map from "./sections/Map.svelte";
  import Characteristics from "./sections/Characteristics.svelte";
  import Crops from "./sections/Crops.svelte";
  import Ndvi from "./sections/NDVI.svelte";
  import SensorStats from "./sections/SensorStats.svelte";
  import { parcelsService } from "src/app/config/config";
  import CurrentWeather from "./sections/CurrentWeather/index.svelte";
  import UsedArea from "./sections/UsedArea.svelte";
  import { selectedEnclosure } from "src/app/config/stores/selectedEnclosure";
  import Page404 from "../../error/Page404.svelte";
  import ProtectedAreaCard from "./components/ProtectedAreaCard.svelte";

  export let id;
  // Set enclosure id to store (global state) in memory
  $: $selectedEnclosure = id;
</script>

<div class="title">
  <h1>Recinto#{id}</h1>
  <ProtectedAreaCard />
</div>
<div class="overview mr-8 container-responsive">
  {#await parcelsService.getEnclosures([])}
    <div>loading...</div>
  {:then parcels}
    {@const parcel = parcels.find((enc) =>
      enc.enclosures.features.some((e) => e.id === id)
    )}
    {@const enclosure = parcel?.enclosures.features.find((e) => e.id === id)}
    {#if !enclosure}
      <Page404 />
    {:else}
      <Map parcels={[parcel]} />
      <Characteristics
        sensorStats={[
          enclosure.properties.area,
          enclosure.properties.irrigation,
          enclosure.properties.slope,
        ]}
      />
      <SensorStats
        sensorStats={[
          enclosure.properties.area,
          enclosure.properties.irrigation,
          enclosure.properties.slope,
        ]}
      />
      <UsedArea
        usedArea={enclosure.properties.usedArea.value}
        totalArea={enclosure.properties.area.value}
      />
      <Crops />
      <Ndvi
        ndviValues={[
          {
            date: "2021-01-01",
            value: 50,
          },
          {
            date: "2021-01-02",
            value: 60,
          },
          {
            date: "2021-01-03",
            value: 70,
          },
          {
            date: "2021-01-04",
            value: 80,
          },
          {
            date: "2021-01-05",
            value: 90,
          },
          {
            date: "2021-01-06",
            value: 43,
          },
        ]}
      />
      <CurrentWeather />
    {/if}
  {:catch error}
    <div>{error.message}</div>
  {/await}
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
      "characteristics"
      "sensor-stats"
      "used-area"
      "crops"
      "ndvi"
      "weather";

    .weather {
      display: none;
    }
  }

  @include media(">large") {
    .overview {
      grid-template-columns: 1.1fr 1fr 0.85fr;
      grid-template-areas:
        "map characteristics characteristics"
        "map sensor-stats sensor-stats"
        "map used-area weather"
        "map crops weather"
        "ndvi crops weather";

      :global(.summary) {
        display: block;
      }
    }
  }
</style>
