<script>
  import Header from "./sections/Header.svelte";
  import Main from "./sections/Main.svelte";
  import Sidebar from "./sections/Sidebar.svelte";
  import SidebarMobile from "./sections/SidebarMobile.svelte";
  import { TABLET_WIDTH } from "src/app/config/constants";

  let mediaQueryMobile = window.matchMedia(`(max-width: ${TABLET_WIDTH}px)`);
  let isInMobile = mediaQueryMobile.matches;

  mediaQueryMobile.addEventListener("change", () => {
    isInMobile = mediaQueryMobile.matches;
  });
</script>

<div class="default-layout">
  <Header />
  {#if isInMobile}
    <SidebarMobile />
  {:else}
    <Sidebar />
  {/if}
  <Main>
    <slot />
  </Main>
</div>

<style lang="scss">
  .default-layout {
    display: grid;
    grid-template-rows: 50px 1fr;
    grid-template-columns: auto 1fr;
    grid-template-areas:
      "sidebar header"
      "sidebar main";
  }
</style>
