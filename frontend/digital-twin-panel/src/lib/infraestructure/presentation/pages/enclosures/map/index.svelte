<script>
  import { parcelsService } from "src/app/config/config";
  import Error from "../../../components/misc/Error.svelte";
  import Loading from "../../../components/misc/Loading.svelte";
  import Map from "./sections/Map.svelte";
  import Stats from "./sections/Stats.svelte";

  export let id;
</script>

<h1 class="title">Recinto#{id} · Mapa</h1>
<div class="container-responsive">
  <Map enclosureId={id} />
  <Stats enclosureId={id} />
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
