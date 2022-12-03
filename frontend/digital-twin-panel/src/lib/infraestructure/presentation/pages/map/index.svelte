<script>
  import Map from "./sections/Map.svelte";
  import Search from "./sections/Search.svelte";
  import SearchPopup from "./components/SearchPopup.svelte";
  import { TABLET_WIDTH } from "src/app/config/constants";
  import { parcelsService } from "src/app/config/config";

  let mediaQueryMobile = window.matchMedia(`(max-width: ${TABLET_WIDTH}px)`);
  let isInMobile = mediaQueryMobile.matches;

  mediaQueryMobile.addEventListener("change", () => {
    isInMobile = mediaQueryMobile.matches;
  });
</script>

<section>
  {#await parcelsService.getEnclosures([])}
    <h1>Cargando...</h1>
  {:then parcels}
    <Map enclosures={parcels.flatMap((parcel) => parcel.enclosures.features)} />
    {#if isInMobile}
      <SearchPopup>
        <Search
          enclosures={parcels.flatMap((parcel) => parcel.enclosures.features)}
        />
      </SearchPopup>
    {:else}
      <Search
        enclosures={parcels.flatMap((parcel) => parcel.enclosures.features)}
      />
    {/if}
  {:catch}
    <h1>Ups! Algo salió mal</h1>
  {/await}
</section>

<style lang="scss">
  section {
    display: grid;
    gap: 0.8rem;
    height: calc(100vh - 5rem);
    @extend .container-responsive;
    grid-template-columns: 1fr 400px;
    overflow: scroll;
  }

  @include media("<large") {
    section {
      padding: 0;
      margin-top: 16px;
      grid-template-columns: 1fr;
      height: calc(100vh - 5rem);
    }
  }
</style>
