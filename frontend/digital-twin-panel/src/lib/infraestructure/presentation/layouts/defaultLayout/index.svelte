<script>
  import Sidebar from "./sections/Sidebar.svelte";
  import Header from "./sections/Header.svelte";
  import Main from "./sections/Main.svelte";
</script>

<div class="default-layout">
  <Header />
  <Sidebar />
  <Main>
    <slot />
  </Main>
</div>

<style lang="scss">
  .default-layout {
    display: grid;
    grid-template-columns: 1fr 8fr;
    grid-template-rows: 65px 1fr;
    grid-template-areas:
      "sidebar header"
      "sidebar main";
  }
</style>
