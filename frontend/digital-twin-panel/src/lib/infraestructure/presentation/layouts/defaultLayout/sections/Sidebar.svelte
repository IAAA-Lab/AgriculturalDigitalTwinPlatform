<script lang="ts">
  import Footer from "./Footer.svelte";
  import SidebarNavBar from "../components/SidebarNavBar.svelte";
  import LogoText from "../components/LogoText.svelte";
  import SidebarNavBarInner from "../components/SidebarNavBarInner.svelte";
</script>

<div class="sidebar-wrapper">
  <aside class="sidebar ml-16">
    <LogoText />
    <SidebarNavBar />
    <Footer />
  </aside>
  <aside class="inner-sidebar">
    <SidebarNavBarInner />
  </aside>
</div>

<style lang="scss">
  .sidebar-wrapper {
    display: flex;
    flex-direction: row;
    column-gap: 0.5rem;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
    grid-area: sidebar;
  }
  aside {
    &.inner-sidebar {
      padding-top: 4.7rem;
      background-color: #ecddd3;
      padding-right: 20px;
      padding-left: 10px;
      height: 100%;
    }
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
