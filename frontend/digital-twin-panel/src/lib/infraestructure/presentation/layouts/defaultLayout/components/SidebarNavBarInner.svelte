<script lang="ts">
  import {
    AppRoutes,
    ENCLOSURE_CROPS_REGEX,
    ENCLOSURE_MAP_REGEX,
    ENCLOSURE_OVERVIEW_REGEX,
    ENCLOSURE_WEATHER_REGEX,
  } from "../../../../../../app/config/constants";

  import { Link } from "svelte-routing";
  import SidebarOption from "../components/SidebarOption.svelte";
  import { selectedEnclosure } from "src/app/config/stores/selectedEnclosure";
  let selected = window.location.pathname;
</script>

<nav>
  <ul>
    <li>
      <Link to={`/enclosure/${$selectedEnclosure}`}>
        <SidebarOption
          text="Recinto"
          selected={ENCLOSURE_OVERVIEW_REGEX.test(selected)}
        >
          <i class="fi fi-rr-location-alt" />
        </SidebarOption>
      </Link>
    </li>
    <li>
      <Link to={`/enclosure/${$selectedEnclosure}/crops`}>
        <SidebarOption
          text="Plantas"
          selected={ENCLOSURE_CROPS_REGEX.test(selected)}
        >
          <i class="fi fi-rr-wheat" />
        </SidebarOption>
      </Link>
    </li>
    <li>
      <Link to={`/enclosure/${$selectedEnclosure}/weather`}>
        <SidebarOption
          text="Tiempo"
          selected={ENCLOSURE_WEATHER_REGEX.test(selected)}
        >
          <i class="fi fi-rr-clouds-sun" />
        </SidebarOption>
      </Link>
    </li>
    <li>
      <Link to={`/enclosure/${$selectedEnclosure}/map`}>
        <SidebarOption
          text="Mapa"
          selected={ENCLOSURE_MAP_REGEX.test(selected)}
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
