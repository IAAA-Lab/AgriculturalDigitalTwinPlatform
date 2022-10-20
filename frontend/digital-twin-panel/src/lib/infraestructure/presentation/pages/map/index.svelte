<script>
  import Map from "./sections/Map.svelte";
  import Search from "./sections/Search.svelte";
</script>

<div class="map">
  <Map />
  <Search />
</div>

<style lang="scss">
  .map {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 0.8rem;
    height: calc(100vh - 5rem);
  }
</style>
