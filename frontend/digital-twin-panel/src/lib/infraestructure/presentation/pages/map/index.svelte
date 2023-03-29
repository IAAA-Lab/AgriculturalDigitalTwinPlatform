<script>
  import Map from "./sections/Map.svelte";
  import Search from "./sections/Search.svelte";
  import SearchPopup from "./components/SearchPopup.svelte";
  import { TABLET_WIDTH } from "src/app/config/constants";
  import { parcelsService } from "src/app/config/config";
  import Loading from "../../components/misc/Loading.svelte";
  import Error from "../../components/misc/Error.svelte";

  let mediaQueryMobile = window.matchMedia(`(max-width: ${TABLET_WIDTH}px)`);
  let isInMobile = mediaQueryMobile.matches;

  mediaQueryMobile.addEventListener("change", () => {
    isInMobile = mediaQueryMobile.matches;
  });
</script>

<h1 class="title">Mapa</h1>
<section class="container-responsive">
  {#await parcelsService.getEnclosures( ["50-99-0-0-28-144-1", "50-99-0-0-2-190-1"] )}
    <Loading />
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
    <Error />
  {/await}
</section>

<style lang="scss">
  section {
    display: grid;
    gap: 0.8rem;
    height: calc(100vh - 5rem);
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
