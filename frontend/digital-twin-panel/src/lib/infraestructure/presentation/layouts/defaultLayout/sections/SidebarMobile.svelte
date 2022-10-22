<script lang="ts">
  import { AppRoutes } from "@/src/app/config/constants";
  import { Link } from "svelte-routing";
  import SidebarOption from "../../../components/misc/SidebarOption.svelte";
  import Footer from "./Footer.svelte";
  import outsideClick from "svelte-outside-click";

  let selected = window.location.pathname;
  let closed = true;

  const closeSidebar = () => {
    closed = true;
  };
  const toggleSidebar = () => {
    closed = !closed;
  };
</script>

<div use:outsideClick={closeSidebar}>
  <div class="burguer-icon" on:click={toggleSidebar}>
    <i class="fi fi-rr-menu-burger" />
  </div>
  <aside class="sidebar-mobile" class:closed>
    <nav>
      <a href={AppRoutes.OVERVIEW}>
        <div class="logo-text mb-32 mt-16">
          <img src="images/logo.png" height={45} alt="logo" />
          <h3 class="m-0 pl-8">GEDEFEC</h3>
        </div>
      </a>
      <ul>
        <li>
          <Link to={AppRoutes.OVERVIEW}>
            <SidebarOption
              text="Overview"
              selected={selected === AppRoutes.OVERVIEW}
            >
              <i color="white" class="fi fi-rr-layout-fluid" />
            </SidebarOption>
          </Link>
        </li>
        <li>
          <Link to={AppRoutes.MAP}>
            <SidebarOption text="Mapa" selected={selected === AppRoutes.MAP}>
              <i class="fi fi-rr-map" />
            </SidebarOption>
          </Link>
        </li>
        <li>
          <Link to={AppRoutes.ANALYTICS}>
            <SidebarOption
              text="Análisis"
              selected={selected === AppRoutes.ANALYTICS}
            >
              <i class="fi fi-rr-chart-pie-alt" />
            </SidebarOption>
          </Link>
        </li>
        <li>
          <Link to={AppRoutes.SIMULATION}>
            <SidebarOption
              text="Gemelos digitales"
              selected={selected === AppRoutes.SIMULATION}
            >
              <i class="fi fi-rr-chart-network" />
            </SidebarOption>
          </Link>
        </li>
        <li>
          <Link to={AppRoutes.SETTINGS}>
            <SidebarOption
              text="Configuración"
              selected={selected === AppRoutes.SETTINGS}
            >
              <i class="fi fi-rr-settings" />
            </SidebarOption>
          </Link>
        </li>
      </ul>
    </nav>
    <Footer />
  </aside>
</div>

<style lang="scss">
  .burguer-icon {
    position: absolute;
    padding-top: 20px;
    padding-left: 17px;
    padding-bottom: 20px;
    padding-right: 17px;
    cursor: pointer;
    z-index: 10;
    left: 0;
    top: 0;
  }

  .sidebar-mobile {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    height: 95vh;
    width: 213px;
    background-color: beige;
    border-radius: 10px;
    padding: 10px;
    transition: all 0.15s ease-in-out;

    nav {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      white-space: nowrap;

      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        li {
          padding-bottom: 7px;
        }
      }
    }

    .logo-text {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      gap: 0.15rem;
    }

    &.closed {
      margin-left: -250px;
    }
  }
</style>
