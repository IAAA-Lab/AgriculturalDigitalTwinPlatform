<script lang="ts">
  import Footer from "./Footer.svelte";
  import SidebarNavBar from "../components/SidebarNavBar.svelte";
  import LogoText from "../components/LogoText.svelte";
</script>

<aside class="sidebar ml-16">
  <LogoText />
  <SidebarNavBar />
  <Footer />
</aside>

<style lang="scss">
  aside {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    grid-area: sidebar;
    height: 100vh;
  }

  @include media("<large") {
    :global {
      .sidebar {
        .sidebar-option-text,
        h3 {
          display: none;
        }
      }
    }
  }
</style>
