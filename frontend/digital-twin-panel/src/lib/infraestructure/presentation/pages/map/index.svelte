<script>
  import Map from "./sections/Map.svelte";
  import Search from "./sections/Search.svelte";
  import SearchPopup from "./components/SearchPopup.svelte";
  import { TABLET_WIDTH } from "@/src/app/config/constants";

  let mediaQueryMobile = window.matchMedia(`(max-width: ${TABLET_WIDTH}px)`);
  let isInMobile = mediaQueryMobile.matches;

  mediaQueryMobile.addEventListener("change", () => {
    isInMobile = mediaQueryMobile.matches;
  });
</script>

<div class="map">
  <Map />
  {#if isInMobile}
    <SearchPopup />
  {:else}
    <Search />
  {/if}
</div>

<style lang="scss">
  .map {
    display: grid;
    gap: 0.8rem;
    height: calc(100vh - 5rem);
    @extend .container-responsive;
    grid-template-columns: 1fr 350px;
  }

  @include media("<=medium") {
    .map {
      padding: 0;
      margin-top: 16px;
      grid-template-columns: 1fr;
      height: calc(100vh - 10rem);
    }
  }
</style>
