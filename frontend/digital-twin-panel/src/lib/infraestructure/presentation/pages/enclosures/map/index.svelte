<script>
  import { parcelsService } from "src/app/config/config";
  import Map from "./sections/Map.svelte";
  import Stats from "./sections/Stats.svelte";

  export let id;
</script>

<h1 class="title">Recinto#{id} · Mapa</h1>
<div class="container-responsive">
  {#await parcelsService.getEnclosures([])}
    <h2>Cargando...</h2>
  {:then parcels}
    {@const parcel = parcels.find((enc) =>
      enc.enclosures.features.some((e) => e.id === "47-124-0-0-4-560-1")
    )}
    {@const enclosure = parcel.enclosures.features.find(
      (e) => e.id === "47-124-0-0-4-560-1"
    )}
    <Map parcels={[enclosure]} />
    <Stats />
  {:catch}
    <h2>error</h2>
  {/await}
</div>

<style lang="scss">
  .container-responsive {
    display: grid;
    gap: 0.8rem;
    height: calc(100vh - 5rem);
    grid-template-rows: 1fr 1fr;
  }

  @include media("<large") {
    .container-responsive {
      height: auto !important;
    }
  }
</style>
