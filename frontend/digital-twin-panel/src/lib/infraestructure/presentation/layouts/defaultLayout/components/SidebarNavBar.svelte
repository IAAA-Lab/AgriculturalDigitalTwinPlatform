<script>
  import { AppRoutes } from "../../../../../../app/config/constants";

  import { Link } from "svelte-routing";
  import SidebarOption from "../components/SidebarOption.svelte";
  import { BASEPATH } from "src/app/config/config";
  let selected = window.location.pathname.replace(BASEPATH, "");
</script>

<nav>
  <ul>
    <li>
      <Link to={BASEPATH + AppRoutes.OVERVIEW}>
        <SidebarOption
          text="Overview"
          selected={selected === AppRoutes.OVERVIEW}
        >
          <i color="white" class="fi fi-rr-layout-fluid" />
        </SidebarOption>
      </Link>
    </li>
    <li>
      <Link to={BASEPATH + AppRoutes.MAP}>
        <SidebarOption text="Mapa" selected={selected === AppRoutes.MAP}>
          <i class="fi fi-rr-map" />
        </SidebarOption>
      </Link>
    </li>
    <li>
      <Link to={BASEPATH + AppRoutes.ANALYTICS}>
        <SidebarOption
          text="Análisis"
          selected={selected === AppRoutes.ANALYTICS}
        >
          <i class="fi fi-rr-chart-pie-alt" />
        </SidebarOption>
      </Link>
    </li>
    <li>
      <Link to={BASEPATH + AppRoutes.SIMULATION}>
        <SidebarOption
          text="Simulaciones"
          selected={selected === AppRoutes.SIMULATION}
        >
          <i class="fi fi-rr-chart-network" />
        </SidebarOption>
      </Link>
    </li>
    <li>
      <Link to={BASEPATH + AppRoutes.SETTINGS}>
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

<style lang="scss">
  nav {
    white-space: nowrap;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      li {
        padding-bottom: 7px;
      }
    }
  }
</style>
