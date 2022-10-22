<script>
  import Header from "./sections/Header.svelte";
  import Main from "./sections/Main.svelte";
  import { onMount } from "svelte";
  import { IS_IN_MOBILE } from "@/src/lib/core/utils";
  import Sidebar from "./sections/Sidebar.svelte";

  let SidebarComp = Sidebar;

  onMount(async () => {
    if (IS_IN_MOBILE) {
      SidebarComp = (await import("./sections/SidebarMobile.svelte")).default;
    }
  });
</script>

<div class="default-layout">
  <Header />
  <svelte:component this={SidebarComp} />
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
