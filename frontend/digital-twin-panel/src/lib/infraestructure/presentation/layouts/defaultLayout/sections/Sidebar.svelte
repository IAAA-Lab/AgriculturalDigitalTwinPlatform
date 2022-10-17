<script lang="ts">
  import { Link } from "svelte-routing";
  import SidebarOption from "../../../components/misc/SidebarOption.svelte";
  import Footer from "./Footer.svelte";
  import { AppRoutes } from "../../../../../../app/config/constants";

  let selected = window.location.pathname;
</script>

<aside class="sidebar">
  <div class="logo-text">
    <h3>GEDEFEC</h3>
  </div>
  <nav>
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
    </ul>
  </nav>
  <Footer />
</aside>

<style lang="scss">
  .sidebar {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    grid-area: sidebar;
    height: 100vh;
    padding: 0px 20px 0px 20px;

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
  }
</style>
