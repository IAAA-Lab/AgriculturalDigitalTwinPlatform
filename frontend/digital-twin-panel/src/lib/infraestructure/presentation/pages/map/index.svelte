<script>
  import Map from "./sections/Map.svelte";
  import Search from "./sections/Search.svelte";
  import SearchPopup from "./components/SearchPopup.svelte";
  import { TABLET_WIDTH } from "src/app/config/constants";
  import { enclosuresService } from "src/app/config/config";
  import Loading from "../../components/misc/Loading.svelte";
  import Error from "../../components/misc/Error.svelte";
  import { listOfEnclosures } from "src/app/config/stores/selectedEnclosure";

  let mediaQueryMobile = window.matchMedia(`(max-width: ${TABLET_WIDTH}px)`);
  let isInMobile = mediaQueryMobile.matches;

  mediaQueryMobile.addEventListener("change", () => {
    isInMobile = mediaQueryMobile.matches;
  });
</script>

<section class="container-responsive">
  <h1 class="title">Mapa</h1>
  <div class="inner__container">
    {#await enclosuresService.getEnclosures($listOfEnclosures)}
      <Loading />
    {:then enclosures}
      <Map {enclosures} />
      {#if isInMobile}
        <SearchPopup>
          <Search {enclosures} />
        </SearchPopup>
      {:else}
        <Search {enclosures} />
      {/if}
    {:catch}
      <Error />
    {/await}
  </div>
</section>

<style lang="scss">
  .inner__container {
    display: grid;
    gap: 0.8rem;
    height: calc(100vh - 8.5rem);
    grid-template-columns: 1fr 400px;
  }

  @include media("<large") {
    .inner__container {
      padding: 0;
      margin-top: 16px;
      grid-template-columns: 1fr;
      height: calc(100vh - 5rem);
    }
  }
</style>
