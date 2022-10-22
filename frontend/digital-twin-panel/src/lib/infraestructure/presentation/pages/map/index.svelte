<script>
  import Map from "./sections/Map.svelte";
  import Search from "./sections/Search.svelte";
  import { onDestroy, onMount } from "svelte";
  import SearchPopup from "./components/SearchPopup.svelte";
  import { IS_IN_MOBILE } from "@/src/lib/core/functions";
</script>

<div class="map">
  <Map />
  {#if IS_IN_MOBILE}
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
