<script lang="ts">
  import Footer from "./Footer.svelte";
  import SidebarNavBar from "../components/SidebarNavBar.svelte";
  import LogoText from "../components/LogoText.svelte";
  import SidebarNavBarInner from "../components/SidebarNavBarInner.svelte";
  import { AppRoutes } from "src/app/config/constants";

  let selected = window.location.pathname;

  console.log(selected);

  let show = true;
  $: show = Object.values(AppRoutes).includes(selected as AppRoutes);
</script>

<div class="sidebar-wrapper">
  <aside class="sidebar" class:collapsed={!show}>
    <LogoText />
    <SidebarNavBar />
    <Footer />
  </aside>
  <aside class="inner-sidebar" class:active={show}>
    <SidebarNavBarInner />
  </aside>
</div>

<style lang="scss">
  .sidebar-wrapper {
    display: flex;
    flex-direction: row;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
    grid-area: sidebar;
  }
  aside {
    margin-left: 10px;
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

  .sidebar {
    &.collapsed {
      :global {
        padding: 0px !important;
        .sidebar-option-text,
        h3 {
          display: none;
        }
      }
    }
  }

  .inner-sidebar {
    &.active {
      display: none;
    }
  }
</style>
