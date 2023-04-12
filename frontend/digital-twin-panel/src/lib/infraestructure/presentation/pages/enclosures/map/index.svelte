<script>
  import { selectedEnclosure } from "src/app/config/stores/selectedEnclosure";
  import Map from "./sections/Map.svelte";
  import Stats from "./sections/Stats.svelte";

  export let id;
  export let idema = "9434";
</script>

<div class="container-responsive">
  <h1 class="title">Recinto#{id} · Mapa</h1>
  <div class="inner__container">
    <Map enclosureId={id} />
    <Stats enclosureId={id} {idema} />
  </div>
</div>

<style lang="scss">
  .inner__container {
    display: grid;
    gap: 0.8rem;
    height: calc(100vh - 7rem);
    grid-template-rows: 1fr 1fr;
  }

  @include media("<large") {
    .inner__container {
      height: auto !important;
    }
  }
</style>
