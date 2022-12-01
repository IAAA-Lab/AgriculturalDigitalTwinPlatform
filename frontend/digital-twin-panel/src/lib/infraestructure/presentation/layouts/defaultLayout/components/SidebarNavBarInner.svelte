<script>
  import { AppRoutes } from "../../../../../../app/config/constants";

  import { Link } from "svelte-routing";
  import SidebarOption from "../components/SidebarOption.svelte";
  let selected = window.location.pathname;
</script>

<nav>
  <ul>
    <li>
      <Link to={AppRoutes.ENCLOSURE_OVERVIEW}>
        <SidebarOption
          text="Recinto"
          selected={selected === AppRoutes.ENCLOSURE_OVERVIEW}
        >
          <i class="fi fi-rr-location-alt" />
        </SidebarOption>
      </Link>
    </li>
    <li>
      <Link to={AppRoutes.ENCLOSURE_CROPS}>
        <SidebarOption
          text="Plantas"
          selected={selected === AppRoutes.ENCLOSURE_CROPS}
        >
          <i class="fi fi-rr-wheat" />
        </SidebarOption>
      </Link>
    </li>
    <li>
      <Link to={AppRoutes.ENCLOSURE_WEATHER}>
        <SidebarOption
          text="Tiempo"
          selected={selected === AppRoutes.ENCLOSURE_WEATHER}
        >
          <i class="fi fi-rr-clouds-sun" />
        </SidebarOption>
      </Link>
    </li>
    <li>
      <Link to={AppRoutes.ENCLOSURE_MAP}>
        <SidebarOption
          text="Mapa"
          selected={selected === AppRoutes.ENCLOSURE_MAP}
        >
          <i class="fi fi-rr-map" />
        </SidebarOption>
      </Link>
    </li>
  </ul>
</nav>

<style lang="scss">
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
</style>
