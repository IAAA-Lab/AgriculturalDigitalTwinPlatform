<script>
  import Header from "./sections/Header.svelte";
  import Main from "./sections/Main.svelte";
  import { onMount } from "svelte";
  import { IS_IN_MOBILE } from "@/src/lib/core/utils";

  let Sidebar;

  // Download the sidebar js dinamically depending on the screen size
  onMount(async () => {
    if (IS_IN_MOBILE) {
      Sidebar = (await import("./sections/SidebarMobile.svelte")).default;
    } else {
      Sidebar = (await import("./sections/Sidebar.svelte")).default;
    }
  });
</script>

<div class="default-layout">
  <Header />
  <svelte:component this={Sidebar} />
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
