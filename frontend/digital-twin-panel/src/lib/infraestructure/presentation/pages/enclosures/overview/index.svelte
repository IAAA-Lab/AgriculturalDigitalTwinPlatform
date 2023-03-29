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
  import Loading from "../../../components/misc/Loading.svelte";
  import Error from "../../../components/misc/Error.svelte";

  export let id;
  // Set enclosure id to store (global state) in memory
  $: $selectedEnclosure = id;
</script>

<div class="title">
  <h1>Recinto#{id}</h1>
  <!-- <ProtectedAreaCard /> -->
</div>
<div class="overview mr-8 container-responsive">
  {#await parcelsService.getEnclosures( ["50-99-0-0-28-144-1", "50-99-0-0-2-190-1"] )}
    <Loading />
  {:then parcels}
    {@const parcel = parcels.find((enc) =>
      enc.enclosures.features.some((e) => e.id === id)
    )}
    {@const enclosure = parcel?.enclosures.features.find((e) => e.id === id)}
    {#if !enclosure}
      <Error />
    {:else}
      <div class="map__crops__wrapper">
        <Map parcels={[parcel]} />
        <Crops enclosureId={id} cropId={enclosure.cropIds[0]} />
      </div>
      <Characteristics
        sensorStats={[
          { ...enclosure.properties.area, name: "Área" },
          { ...enclosure.properties.irrigation, name: "Regadío" },
          { ...enclosure.properties.slope, name: "Inclinación" },
        ]}
      />
      <SensorStats
        sensorStats={[
          { name: "Humedad", value: 50, unit: "%" },
          { name: "Temperatura", value: 4, unit: "ºC" },
          { name: "PH", value: 7, unit: "" },
        ]}
      />
      <UsedArea
        usedArea={enclosure.properties.usedArea.value}
        totalArea={enclosure.properties.area.value}
      />
      <Ndvi enclosureId={id} />
      <CurrentWeather enclosureId={id} />
    {/if}
  {:catch error}
    <div>{error.message}</div>
  {/await}
</div>

<style lang="scss">
  .map__crops__wrapper {
    grid-area: map-crops;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
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
      "map-crops"
      "characteristics"
      "sensor-stats"
      "used-area"
      "ndvi"
      "weather";

    .weather {
      display: none;
    }
  }

  @include media(">large") {
    .overview {
      grid-template-columns: 1.1fr 1fr 0.7fr;
      grid-template-areas:
        "map-crops characteristics characteristics"
        "map-crops sensor-stats sensor-stats"
        "map-crops used-area weather"
        "map-crops ndvi weather"
        "crops ndvi weather";

      :global(.summary) {
        display: block;
      }
    }
  }
</style>
