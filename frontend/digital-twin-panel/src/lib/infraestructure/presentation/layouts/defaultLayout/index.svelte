<script>
  import Sidebar from "./sections/Sidebar.svelte";
  import Header from "./sections/Header.svelte";
  import Main from "./sections/Main.svelte";
  import { toggleSidebar } from "@/src/lib/core/utils";

  let width;

  // When screen width is less than 768px, sidebar is hidden by default
  $: if (width < 768) {
    const sidebar = document.querySelector(".sidebar");
    sidebar?.classList.toggle("not-active");
  }
</script>

<div class="default-layout">
  <Header />
  <Sidebar />
  <Main>
    <slot />
  </Main>
</div>

<!-- For sidebar toggle -->
<svelte:window bind:innerWidth={width} />

<style lang="scss">
  .default-layout {
    display: grid;
    grid-template-rows: 50px 1fr;
    grid-template-areas:
      "sidebar header"
      "sidebar main";
  }
  @include media("<medium") {
    .default-layout {
      grid-template-rows: 50px 1fr;
      grid-template-columns: 1fr;
      grid-template-areas:
        "header"
        "main";

      :global(.sidebar) {
        display: none;
      }
    }
  }

  @include media("<large") {
    :global {
      .sidebar-option-text {
        display: none;
      }
      .logo-text {
        h3 {
          display: none;
        }
      }
    }
  }
</style>
