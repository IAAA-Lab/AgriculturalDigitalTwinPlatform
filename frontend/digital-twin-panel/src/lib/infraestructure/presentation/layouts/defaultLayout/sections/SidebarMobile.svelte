<script lang="ts">
  import Footer from "./Footer.svelte";
  import outsideClick from "svelte-outside-click";
  import SidebarNavBar from "../components/SidebarNavBar.svelte";
  import LogoText from "../components/LogoText.svelte";
  import SidebarToggle from "../components/SidebarToggle.svelte";
  import SidebarNavBarInner from "../components/SidebarNavBarInner.svelte";

  let closed = true;
  let collapsed = false;

  const closeSidebar = () => {
    closed = true;
  };
  const toggleSidebar = () => {
    closed = !closed;
  };
</script>

<div use:outsideClick={closeSidebar}>
  <div class="burguer-icon" on:click={toggleSidebar} on:keydown={toggleSidebar}>
    <SidebarToggle />
  </div>
  <div class="sidebar__wrapper" class:closed>
    <aside class="sidebar" class:collapsed>
      <LogoText />
      <SidebarNavBar />
      <Footer />
    </aside>
    <aside class="sidebar__inner">
      <SidebarNavBarInner bind:notShow={collapsed} />
    </aside>
  </div>
</div>

<style lang="scss">
  .sidebar__wrapper {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    height: 100vh;

    display: flex;
    flex-direction: row;
    transition: all 0.25s cubic-bezier(0.39, 0.575, 0.565, 1);
    &.closed {
      margin-left: -500px;
      opacity: 0.5;
    }
  }

  .sidebar {
  }
  aside {
    height: 100%;
    background-color: #f5ebe5;
    border-radius: 10px;
    padding: 10px;

    &.sidebar__inner {
      padding-top: 5.25rem;
      background-color: #ecddd3;
      padding-right: 20px;
      padding-left: 10px;
      height: 100%;
    }
  }
</style>
