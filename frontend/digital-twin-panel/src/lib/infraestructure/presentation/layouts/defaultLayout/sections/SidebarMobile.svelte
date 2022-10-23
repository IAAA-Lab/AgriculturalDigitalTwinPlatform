<script lang="ts">
  import Footer from "./Footer.svelte";
  import outsideClick from "svelte-outside-click";
  import SidebarNavBar from "../components/SidebarNavBar.svelte";
  import LogoText from "../components/LogoText.svelte";
  import SidebarToggle from "../components/SidebarToggle.svelte";

  let closed = true;

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
  <aside class:closed>
    <LogoText />
    <SidebarNavBar />
    <Footer />
  </aside>
</div>

<style lang="scss">
  aside {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    height: 95vh;
    width: 213px;
    background-color: beige;
    border-radius: 10px;
    padding: 10px;
    transition: all 0.25s cubic-bezier(0.39, 0.575, 0.565, 1);

    &.closed {
      margin-left: -250px;
      opacity: 0.5;
    }
  }
</style>
